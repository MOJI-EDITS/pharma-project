import { NextResponse } from 'next/server';
import { inMemoryStore } from '@/lib/in-memory-store';
import bcrypt from 'bcryptjs';
import { validateSignUp } from '@/lib/validation';
import { sendEmail, getVerificationEmailTemplate } from '@/lib/email';
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    // Rate limiting: 5 signup attempts per hour per IP
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = rateLimit(ip, { interval: 60 * 60 * 1000, maxRequests: 5 });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }

    const body = await req.json();
    const { name, email, password, confirmPassword } = body;

    // Validate input
    const validation = validateSignUp({ name, email, password, confirmPassword });
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await inMemoryStore.findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered. Please sign in or use a different email.' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create user
    const user = await inMemoryStore.createUser({
      name,
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiry: verificationTokenExpiry,
      emailVerified: false,
      role: 'user',
      accountStatus: 'active',
    });

    // Send verification email
    const verificationLink = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;
    try {
      await sendEmail({
        to: email,
        subject: 'Verify your Pharma Plus email',
        html: getVerificationEmailTemplate(verificationLink, name),
      });
    } catch (emailError) {
      console.warn('Email send failed, but account created:', emailError);
    }

    // Development mode: return verification link for testing
    const response: any = {
      ok: true,
      id: user.id,
      message: 'Account created. Please verify your email to activate your account.',
      requiresEmailVerification: true,
    };

    // Include debug info in development mode
    if (process.env.NODE_ENV !== 'production') {
      response.dev = {
        verificationLink,
        verificationToken,
        debugEndpoint: `/api/dev/verify-email?email=${email}`,
      };
    }

    return NextResponse.json(response);
  } catch (e) {
    console.error('signup error', e);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}

