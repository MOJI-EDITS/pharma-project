'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
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
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        if (!response.ok) {
          setError(data?.error || 'Unable to load orders.');
          return;
        }
        setOrders(data);
      } catch (err) {
        setError('Unable to load orders.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const totalOrders = orders.length;
  const totalRevenue = useMemo(
    () => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
      orders.reduce((sum, order) => sum + order.totalAmount, 0)
    ),
    [orders]
  );

  return (
    <InfoPage title="My Orders">
      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
          <p className="text-gray-700">Loading your order history…</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <Link
            href="/auth/signin"
            className="inline-flex justify-center bg-[#2563eb] text-white px-6 py-3 rounded-md font-medium hover:bg-[#1d4ed8]"
          >
            Sign In
          </Link>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
          <p className="text-gray-700 mb-4">You don’t have any orders yet.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex justify-center bg-[#2563eb] text-white px-6 py-3 rounded-md font-medium hover:bg-[#1d4ed8]"
            >
              Shop Now
            </Link>
            <Link
              href="/track-order"
              className="inline-flex justify-center border border-[#2563eb] text-[#2563eb] px-6 py-3 rounded-md font-medium hover:bg-blue-50"
            >
              Track an Order
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{totalOrders}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{totalRevenue}</p>
            </div>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/orders/${order._id}`}
                className="block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-[#2563eb] hover:bg-blue-50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="text-lg font-semibold text-gray-900">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="mt-1 font-medium text-[#2563eb]">{order.orderStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.totalAmount)}
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {order.items.map((item) => (
                    <div key={`${order._id}-${item.productId}`} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-500">
                        {item.strength ?? item.form ?? 'Product details'}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-gray-900">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Need help with an order?</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/track-order"
                className="inline-flex justify-center border border-[#2563eb] text-[#2563eb] px-6 py-3 rounded-md font-medium hover:bg-blue-50"
              >
                Track a specific order
              </Link>
              <Link
                href="/contact"
                className="inline-flex justify-center bg-[#2563eb] text-white px-6 py-3 rounded-md font-medium hover:bg-[#1d4ed8]"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      )}
    </InfoPage>
  );
}
