import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OrderModel from '@/models/Order';
import { auth } from '../../../../../auth';

export async function GET(req: Request) {
  let session;
  try {
    const authMod = await import('../../../../../auth');
    session = await authMod.auth();
  } catch (e) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 503 });
  }
  if (!session || session.user?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    await dbConnect();
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const query: any = {};
    if (status) query.orderStatus = status;
    const orders = await OrderModel.find(query).sort({ createdAt: -1 }).lean().exec();
    return NextResponse.json(orders);
  } catch (e) {
    console.error('admin orders get error', e);
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
  if (!session || session.user?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const body = await req.json();
    await dbConnect();
    const updated = await OrderModel.findByIdAndUpdate(id, body, { new: true }).lean().exec();
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    console.error('admin orders update error', e);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}
