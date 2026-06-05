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
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await dbConnect();
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const query: any = {};
    if (status) query.status = status;
    const prescriptions = await PrescriptionModel.find(query).sort({ createdAt: -1 }).lean().exec();
    return NextResponse.json(prescriptions);
  } catch (e) {
    console.error('admin prescriptions get error', e);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  let session;
  try {
    const authMod = await import('../../../../../auth');
    session = await authMod.auth();
  } catch (e) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 503 });
  }
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const body = await req.json();
    await dbConnect();
    const updated = await PrescriptionModel.findByIdAndUpdate(id, body, { new: true }).lean().exec();
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    console.error('admin prescriptions update error', e);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}
