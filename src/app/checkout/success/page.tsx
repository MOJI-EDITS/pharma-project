'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  strength?: string;
  form?: string;
  image?: string;
}

interface OrderResult {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  shippingAddress?: {
    line1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export default function CheckoutSuccessPage() {
  const { clearCart } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formattedTotal = useMemo(() => {
    return order ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.totalAmount) : '';
  }, [order]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (!sessionId) {
      setError('Missing checkout session ID.');
      setLoading(false);
      return;
    }

    async function verifyCheckout() {
      try {
        const response = await fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data?.error || 'Unable to verify order.');
          return;
        }

        if (!data?.paymentVerified) {
          setError('Payment verification failed or is still pending.');
          return;
        }

        setOrder(data.order);
        clearCart();
      } catch (fetchError) {
        setError('Checkout verification request failed.');
      } finally {
        setLoading(false);
      }
    }

    verifyCheckout();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900">Verifying your order...</h1>
            <p className="text-gray-600">We are confirming payment and fetching your order details.</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="w-16 h-16 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">Verification Error</h1>
            <p className="text-gray-600 max-w-xl">{error}</p>
            <Link
              href="/cart"
              className="inline-block bg-[#2563eb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1d4ed8] transition-colors"
            >
              Return to Cart
            </Link>
          </div>
        ) : order ? (
          <div>
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Thank you for your purchase, {order.customerName || 'valued customer'}. Your order has been confirmed and is now being processed.
            </p>

            <div className="grid gap-4 text-left mb-8">
              <div className="rounded-xl border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h2>
                <p className="text-sm text-gray-700">Order ID: <span className="font-medium text-gray-900">{order.id}</span></p>
                <p className="text-sm text-gray-700">Order status: <span className="font-medium">{order.orderStatus}</span></p>
                <p className="text-sm text-gray-700">Payment status: <span className="font-medium">{order.paymentStatus}</span></p>
                <p className="text-sm text-gray-700">Total: <span className="font-medium">{formattedTotal}</span></p>
              </div>
              {order.shippingAddress && (
                <div className="rounded-xl border border-gray-200 p-5">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h2>
                  <p className="text-sm text-gray-700">{order.shippingAddress.line1}</p>
                  <p className="text-sm text-gray-700">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p className="text-sm text-gray-700">{order.shippingAddress.country}</p>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 p-5 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Items Purchased</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId + item.name} className="flex justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.strength ?? item.form ?? 'Product details'}</p>
                    </div>
                    <p className="font-semibold text-gray-900">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/products"
              className="inline-block bg-[#2563eb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1d4ed8] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="w-16 h-16 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">No order found</h1>
            <p className="text-gray-600">We couldn't locate your order details. Please contact support if you need help.</p>
            <Link
              href="/products"
              className="inline-block bg-[#2563eb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1d4ed8] transition-colors"
            >
              Shop More
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
