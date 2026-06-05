import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import OrderModel from '@/models/Order';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    if (!sessionId) return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });

    const stripe = new Stripe(secret, ({ apiVersion: '2025-12-15' } as unknown) as any);
    const session = await stripe.checkout.sessions.retrieve(sessionId as string);

    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    if (session.payment_status === 'paid') {
      const orderId = (session.metadata as any)?.orderId;
      if (orderId) {
        await dbConnect();
        const order = await OrderModel.findById(orderId).exec();
        if (order) {
          if (order.paymentStatus !== 'paid') {
            order.paymentStatus = 'paid';
            await order.save();
          }

          return NextResponse.json({ paymentVerified: true, order });
        }
      }

      return NextResponse.json({ paymentVerified: false, error: 'Order not found for this session' }, { status: 404 });
    }

    return NextResponse.json({ paymentVerified: false, paymentStatus: session.payment_status });
  } catch (e) {
    console.error('verify checkout error', e);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}
