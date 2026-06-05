import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PrescriptionModel from '@/models/Prescription';

export async function GET(req: Request) {
  let session;
  try {
    const authMod = await import('../../../../../auth');
    session = await authMod.auth();
  } catch (e) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 503 });
  }

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const query: any = { userId: session.user.id };
    const prescriptions = await PrescriptionModel.find(query).sort({ createdAt: -1 }).lean().exec();
    return NextResponse.json(prescriptions);
  } catch (e) {
    console.error('prescription history error', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
