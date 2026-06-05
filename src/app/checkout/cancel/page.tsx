'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-8">
          Your payment was cancelled and you have not been charged.
          You can try again or continue shopping.
        </p>
        <div className="flex flex-col space-y-3">
          <Link
            href="/cart"
            className="inline-block bg-[#2563eb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1d4ed8] transition-colors"
          >
            Return to Cart
          </Link>
          <Link
            href="/products"
            className="inline-block text-[#2563eb] font-semibold hover:text-[#1d4ed8] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
