import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CartItem } from '@/lib/store/cartStore';
import dbConnect from '@/lib/mongodb';
import OrderModel from '@/models/Order';
import PrescriptionModel from '@/models/Prescription';

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
    const stripe = new Stripe(stripeSecretKey, ({ apiVersion: '2025-12-15', typescript: true } as unknown) as any);

    const authMod = await import('../../../../auth');
    const authSession = await authMod.auth();
    const authenticatedUserId = authSession?.user?.id as string | undefined;
    const authenticatedEmail = authSession?.user?.email as string | undefined;
    const hasPrescriptionItem = items.some((item: CartItem) => item.isPrescription);

    if (hasPrescriptionItem) {
      await dbConnect();
      const existingPrescription = await PrescriptionModel.findOne({
        $or: [
          { userId: authenticatedUserId },
          { customerEmail: authenticatedEmail },
        ],
        status: { $in: ['pending', 'verified'] },
      }).lean().exec();

      if (!existingPrescription) {
        return NextResponse.json(
          {
            error: 'Prescription items require an uploaded prescription before checkout.',
            prescriptionRequired: true,
          },
          { status: 403 }
        );
      }
    }

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

    // create pending order in DB so we can reconcile after payment
    await dbConnect();
    const total = items.reduce((s: number, it: CartItem) => s + it.price * it.quantity, 0);
    const pendingOrder = await OrderModel.create({
      userId: authenticatedUserId,
      customerName: authenticatedEmail ? authSession?.user?.name || 'Customer' : items[0]?.name || 'Customer',
      customerEmail: authenticatedEmail || '',
      items: items.map((it: CartItem) => ({ productId: it.id || '', name: it.name, price: it.price, quantity: it.quantity, strength: it.strength, form: it.form, image: it.image })),
      totalAmount: total,
      paymentStatus: 'pending',
      orderStatus: 'Processing',
    });

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'link'], // Add more payment methods as needed
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/cancel`,
      metadata: { orderId: pendingOrder._id.toString() },
    });
    // store stripe session id on order
    pendingOrder.stripeSessionId = stripeSession.id;
    await pendingOrder.save();

    return NextResponse.json({ sessionId: stripeSession.id, url: stripeSession.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
