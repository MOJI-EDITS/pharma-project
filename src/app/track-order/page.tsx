'use client';

import { useMemo, useState } from 'react';
import InfoPage from '@/components/layout/InfoPage';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  strength?: string;
  form?: string;
  image?: string;
}

interface Order {
  _id: string;
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
  createdAt: string;
}

const statusSteps = ['Processing', 'Shipped', 'Delivered'];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const statusIndex = useMemo(() => {
    if (!order) return 0;
    return statusSteps.indexOf(order.orderStatus) !== -1 ? statusSteps.indexOf(order.orderStatus) : 0;
  }, [order]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await fetch(`/api/orders/track?id=${encodeURIComponent(orderId)}&email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || 'Unable to find the order.');
      } else {
        setOrder(data);
      }
    } catch (err) {
      setError('Unable to fetch order status.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <InfoPage title="Track Your Order" maxWidth="md">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Order Number</label>
          <input
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            type="text"
            placeholder="Enter your order number"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Enter your email address"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !orderId || !email}
          className="w-full bg-[#2563eb] text-white py-2 px-4 rounded-md font-medium hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Checking…' : 'Track Order'}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {order && (
        <div className="mt-8 space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="font-semibold text-gray-900">{order._id}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="text-gray-900">{order.customerName}</p>
              <p className="text-sm text-gray-500">{order.customerEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Status</p>
              <p className="font-semibold text-[#2563eb]">{order.orderStatus}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500">Shipping Address</p>
            <p className="text-gray-900">{order.shippingAddress?.line1 || 'Not available'}</p>
            <p className="text-sm text-gray-500">
              {order.shippingAddress?.city || ''} {order.shippingAddress?.state || ''} {order.shippingAddress?.postalCode || ''}
            </p>
            <p className="text-sm text-gray-500">{order.shippingAddress?.country || ''}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Order progress</p>
            <div className="space-y-4">
              {statusSteps.map((step, index) => (
                <div key={step} className="flex items-start gap-4">
                  <div
                    className={`mt-1 h-3 w-3 rounded-full ${index <= statusIndex ? 'bg-[#2563eb]' : 'bg-gray-300'}`}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{step}</p>
                    <p className="text-sm text-gray-500">
                      {index <= statusIndex
                        ? 'Completed'
                        : 'Waiting for the next update.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Items</p>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={`${order._id}-${item.productId}`} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-sm text-gray-500">{item.strength ?? item.form ?? 'Details unavailable'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">Order total</p>
            <p className="text-xl font-semibold text-gray-900">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.totalAmount)}
            </p>
          </div>
        </div>
      )}
    </InfoPage>
  );
}
