import { NextResponse } from 'next/server';
import { inMemoryStore } from '@/lib/in-memory-store';

/**
 * DEV ONLY - Helper endpoint to verify email without needing actual email service
 * Usage: GET /api/dev/verify-email?email=user@example.com
 */
export async function GET(req: Request) {
  try {
    // Only allow in development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await inMemoryStore.findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Email already verified' },
        { status: 200 }
      );
    }

    // Verify the email
    await inMemoryStore.updateUser(user.id, {
      emailVerified: true,
      emailVerificationToken: undefined,
      emailVerificationTokenExpiry: undefined,
    });

    return NextResponse.json({
      ok: true,
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: true,
      },
    });
  } catch (error) {
    console.error('Dev email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
