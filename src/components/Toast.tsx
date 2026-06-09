'use client';

import { useToastStore } from '@/lib/store/toastStore';
import { X, Check, AlertCircle, Info, ShoppingCart } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto animate-slide-up"
        >
          <div
            className={`rounded-lg shadow-2xl px-5 py-4 flex items-start gap-3 max-w-md backdrop-blur-sm border ${
              toast.type === 'success'
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                : toast.type === 'error'
                ? 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
            }`}
          >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                  <ShoppingCart className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              {toast.type === 'error' && (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-rose-500">
                  <AlertCircle className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              {toast.type === 'info' && (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
                  <Info className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {toast.productName && (
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {toast.productName}
                </p>
              )}
              <p
                className={`text-sm ${
                  toast.type === 'success'
                    ? 'text-green-800'
                    : toast.type === 'error'
                    ? 'text-red-800'
                    : 'text-blue-800'
                }`}
              >
                {toast.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className={`flex-shrink-0 p-1 rounded-full transition-colors ${
                toast.type === 'success'
                  ? 'text-green-600 hover:bg-green-100'
                  : toast.type === 'error'
                  ? 'text-red-600 hover:bg-red-100'
                  : 'text-blue-600 hover:bg-blue-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
