import { NextResponse } from 'next/server';
import { inMemoryStore } from '@/lib/in-memory-store';
import bcrypt from 'bcryptjs';
import { validatePassword } from '@/lib/validation';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password, confirmPassword } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Invalid reset link' },
        { status: 400 }
      );
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json(
        { error: passwordError.message },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    const user = await inMemoryStore.findByResetToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Reset link has expired or is invalid' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Update user
    await inMemoryStore.updateUser(user.id, {
      password: hashedPassword,
      passwordResetToken: undefined,
      passwordResetTokenExpiry: undefined,
    });

    return NextResponse.json({
      ok: true,
      message: 'Password reset successfully! You can now sign in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
