import { NextResponse } from 'next/server';
import { inMemoryStore } from '@/lib/in-memory-store';

/**
 * DEV ONLY - Debug endpoint to see all users and their verification status
 * Usage: GET /api/dev/users
 */
export async function GET() {
  try {
    // Only allow in development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development' },
        { status: 403 }
      );
    }

    const users = await inMemoryStore.getAllUsers();

    return NextResponse.json({
      ok: true,
      totalUsers: users.length,
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        emailVerificationToken: user.emailVerificationToken || null,
        emailVerificationTokenExpiry: user.emailVerificationTokenExpiry || null,
        verificationLink: user.emailVerificationToken 
          ? `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${user.emailVerificationToken}`
          : null,
        role: user.role,
        createdAt: new Date(user.createdAt).toISOString(),
      })),
    });
  } catch (error) {
    console.error('Dev users endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
