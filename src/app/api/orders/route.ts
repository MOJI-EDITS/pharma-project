import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OrderModel from '@/models/Order';
import { auth } from '../../../../auth';

export async function GET(req: Request) {
  try {
    let session;
    try {
      const authMod = await import('../../../../auth');
      session = await authMod.auth();
    } catch (e) {
      return NextResponse.json({ error: 'Auth not configured' }, { status: 503 });
    }
    const url = new URL(req.url);
    let userId = url.searchParams.get('userId');
    const email = url.searchParams.get('email');
    if (!userId) {
      if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      userId = session.user.id as string;
    }
    await dbConnect();
    const query: any = { userId };
    if (email) query.customerEmail = email;
    const orders = await OrderModel.find(query).sort({ createdAt: -1 }).lean().exec();
    return NextResponse.json(orders);
  } catch (e) {
    console.error('orders fetch error', e);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}
