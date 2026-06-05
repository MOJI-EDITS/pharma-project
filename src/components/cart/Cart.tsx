'use client';

import { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/cart');
      onClose();
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4 bg-[#2563eb]">
            <h2 className="text-lg font-semibold text-white">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center">
                <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
                <button
                  onClick={onClose}
                  className="mt-4 text-[#2563eb] hover:text-[#1d4ed8] font-semibold"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.strength} • {item.form}</p>
                      <p className="text-sm font-semibold text-[#2563eb]">Rs{item.price}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="rounded-md p-1 hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="rounded-md p-1 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded-md p-1 text-red-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t px-6 py-4 bg-gray-50">
              <div className="flex justify-between text-lg font-semibold mb-4">
                <span className="text-gray-700">Total:</span>
                <span className="text-[#2563eb]">Rs{getTotal().toFixed(2)}</span>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-[#2563eb] text-white py-3 px-4 rounded-lg hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold shadow-sm"
              >
                {isCheckingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
              
              <button
                onClick={clearCart}
                className="mt-2 w-full text-red-600 hover:text-red-700 text-sm font-semibold"
              >
                Clear cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
