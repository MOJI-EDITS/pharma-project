 'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const hasPrescriptionItems = items.some((item) => item.isPrescription);

  const handleCheckout = async () => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/cart');
      return;
    }

    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data.error);
        alert('Failed to start checkout. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven&apos;t added any products to your cart yet.</p>
          <Link
            href="/products"
            className="inline-block bg-[#2563eb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1d4ed8] transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 font-bold text-xl">{item.name.charAt(0)}</span>
                  </div>

                  <div className="flex-1 w-full text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">{item.strength} • {item.form}</p>
                    {item.isPrescription && (
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Prescription Required</span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-50 transition-colors">
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-10 text-center text-gray-900 font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-50 transition-colors">
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <p className="font-bold text-gray-900">Rs{(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    <button onClick={() => removeItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              {hasPrescriptionItems && (
                <div className="mb-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
                  <p className="font-semibold">Prescription required</p>
                  <p>Your cart contains prescription-only items. Please upload a prescription on the prescription page before checkout.</p>
                  <Link href="/prescriptions" className="mt-2 inline-block text-[#2563eb] hover:underline">Upload prescription now</Link>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs{getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span>Rs{getTotal().toFixed(2)}</span>
              </div>
            </div>

            <button onClick={handleCheckout} disabled={isCheckingOut} className="w-full bg-[#2563eb] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#1d4ed8] transition-colors flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm mt-4">
              {isCheckingOut ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="mt-4 text-xs text-center text-gray-500">Secure checkout powered by Stripe</p>
          </div>
        </div>
      </div>
    </div>
  );
}
