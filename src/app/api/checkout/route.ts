import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CartItem } from '@/lib/store/cartStore';

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Stripe secret key not configured' }, { status: 500 });
    }

    // stripe constructor options typed strictly by library types; cast to any to avoid literal mismatch
    const stripe = new Stripe(stripeSecretKey, ({ apiVersion: '2024-04-10', typescript: true } as unknown) as any);

    const lineItems = items.map((item: CartItem) => ({
      price_data: {
        currency: 'usd', // Using USD as a widely supported currency for demo
        product_data: {
          name: item.name,
          description: `${item.strength} - ${item.form}`,
          // images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents
      },
      quantity: item.quantity,
    }));

    // Generate mock order ID (no MongoDB)
    const mockOrderId = 'ORD-' + Date.now();

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'link'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?checkout=cancelled`,
      metadata: { orderId: mockOrderId },
    });

    return NextResponse.json({ sessionId: stripeSession.id, url: stripeSession.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
