'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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

interface OrderDetail {
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

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string | undefined;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formattedTotal = useMemo(() => {
    return order
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.totalAmount)
      : '';
  }, [order]);

  useEffect(() => {
    if (!orderId) {
      setError('Order ID is missing.');
      setLoading(false);
      return;
    }

    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
        const data = await response.json();
        if (!response.ok) {
          setError(data?.error || 'Unable to load order details.');
          return;
        }
        setOrder(data);
      } catch (err) {
        setError('Unable to load order details.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  return (
    <InfoPage title="Order Details" maxWidth="4xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">Order reference</p>
            <p className="text-2xl font-semibold text-gray-900">{order?._id ?? orderId}</p>
          </div>
          <Link
            href="/orders"
            className="inline-flex items-center justify-center rounded-md border border-[#2563eb] px-5 py-3 text-sm font-medium text-[#2563eb] hover:bg-blue-50"
          >
            Back to My Orders
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
            <p className="text-gray-700">Loading order details…</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm text-center">
            <p className="text-red-700">{error}</p>
          </div>
        ) : order ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Status</p>
                <p className="mt-2 text-lg font-semibold text-[#2563eb]">{order.orderStatus}</p>
                <p className="mt-2 text-sm text-gray-500">Payment: {order.paymentStatus}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Total paid</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{formattedTotal}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Date placed</p>
                <p className="mt-2 text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Shipping details</h2>
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <p>{order.customerName}</p>
                <p>{order.customerEmail}</p>
                <p>{order.shippingAddress?.line1 || 'Address not available'}</p>
                <p>{order.shippingAddress?.city ?? ''} {order.shippingAddress?.state ?? ''} {order.shippingAddress?.postalCode ?? ''}</p>
                <p>{order.shippingAddress?.country ?? ''}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Items in this order</h2>
              <div className="mt-4 space-y-4">
                {order.items.map((item) => (
                  <div key={`${order._id}-${item.productId}`} className="grid gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-[1fr_auto]">
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-500">{item.strength ?? item.form ?? 'Product details'}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
            <p className="text-gray-700">Order details are not available.</p>
          </div>
        )}
      </div>
    </InfoPage>
  );
}
