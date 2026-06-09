import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { inMemoryStore } from '@/lib/in-memory-store';

// Get user's prescription history
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await inMemoryStore.findUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const prescriptions = await inMemoryStore.getUserPrescriptions(user.id);
    const activePrescriptions = await inMemoryStore.getActivePrescriptions(user.id);

    return NextResponse.json({
      success: true,
      prescriptions,
      activePrescriptions,
      total: prescriptions.length,
      activeCount: activePrescriptions.length,
    });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prescriptions' },
      { status: 500 }
    );
  }
}

// Create new prescription (usually by AI recommendation or manual upload)
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const user = await inMemoryStore.findUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const prescription = await inMemoryStore.createPrescription(user.id, body);

    return NextResponse.json({
      success: true,
      prescription,
      message: 'Prescription created successfully',
    });
  } catch (error) {
    console.error('Error creating prescription:', error);
    return NextResponse.json(
      { error: 'Failed to create prescription' },
      { status: 500 }
    );
  }
}
