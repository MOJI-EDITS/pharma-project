import { NextResponse } from 'next/server';
import { inMemoryStore } from '@/lib/in-memory-store';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Invalid verification link' },
        { status: 400 }
      );
    }

    const user = await inMemoryStore.findByVerificationToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Verification link has expired or is invalid' },
        { status: 400 }
      );
    }

    // Update user
    await inMemoryStore.updateUser(user.id, {
      emailVerified: true,
      emailVerificationToken: undefined,
      emailVerificationTokenExpiry: undefined,
    });

    return NextResponse.json({
      ok: true,
      message: 'Email verified successfully! You can now sign in.',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
