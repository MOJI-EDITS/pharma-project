import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OrderModel from '@/models/Order';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id;
    if (!orderId) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }

    const authMod = await import('../../../../../auth');
    const session = await authMod.auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const order = await OrderModel.findById(orderId).lean().exec();
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const isOwner = order.userId === session.user.id || order.customerEmail === session.user.email;
    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (e) {
    console.error('order detail fetch error', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
