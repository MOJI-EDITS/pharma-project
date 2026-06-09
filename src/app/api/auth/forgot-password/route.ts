import { NextResponse } from 'next/server';
import { inMemoryStore } from '@/lib/in-memory-store';
import { validateEmail } from '@/lib/validation';
import { sendEmail, getPasswordResetEmailTemplate } from '@/lib/email';
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    // Rate limiting: 5 attempts per hour per IP
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = rateLimit(ip, { interval: 60 * 60 * 1000, maxRequests: 5 });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many password reset attempts. Please try again later.' },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }

    const body = await req.json();
    const { email } = body;

    const emailError = validateEmail(email);
    if (emailError) {
      return NextResponse.json(
        { error: emailError.message },
        { status: 400 }
      );
    }

    const user = await inMemoryStore.findUserByEmail(email);

    // Security: Always return success even if email not found
    if (!user) {
      return NextResponse.json({
        ok: true,
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

    // Save token to user
    await inMemoryStore.updateUser(user.id, {
      passwordResetToken: resetToken,
      passwordResetTokenExpiry: resetTokenExpiry,
    });

    // Send reset email
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    try {
      await sendEmail({
        to: email,
        subject: 'Reset your Pharma Plus password',
        html: getPasswordResetEmailTemplate(resetLink, user.name),
      });
    } catch (emailError) {
      console.warn('Email send failed:', emailError);
    }

    return NextResponse.json({
      ok: true,
      message: 'If an account exists with this email, you will receive a password reset link.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
