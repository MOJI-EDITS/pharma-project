import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OrderModel from '@/models/Order';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const email = url.searchParams.get('email');
    if (!id || !email) return NextResponse.json({ error: 'Missing id or email' }, { status: 400 });
    await dbConnect();
    const order = await OrderModel.findOne({ _id: id, customerEmail: email }).lean().exec();
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(order);
  } catch (e) {
    console.error('track order error', e);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}
