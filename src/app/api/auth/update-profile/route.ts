import { NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { inMemoryStore } from '@/lib/in-memory-store';

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, phone, address } = body;

    const user = await inMemoryStore.findUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user fields
    const updated = await inMemoryStore.updateUser(user.id, {
      name: name || user.name,
      phone: phone || user.phone,
      address: address || user.address,
    });

    return NextResponse.json({
      ok: true,
      message: 'Profile updated successfully',
      user: {
        id: updated!.id,
        name: updated!.name,
        email: updated!.email,
        phone: updated!.phone,
        address: updated!.address,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
