'use client';

import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useCartStore } from '@/lib/store/cartStore';
import { useToastStore } from '@/lib/store/toastStore';
import { useHydration } from '@/lib/hooks/useHydration';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const { addToast } = useToastStore();
  const isHydrated = useHydration();
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      strength: item.strength,
      form: item.form,
      isPrescription: false,
    });
    
    // Show toast notification
    addToast({
      message: 'Added to cart successfully!',
      productName: item.name,
      type: 'success',
      duration: 3000,
    });
    
    setAddedToCart(item.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  if (!isHydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading your wishlist...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/products" className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 font-medium mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Products</span>
          </Link>
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-gray-600">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start adding items to your wishlist to save them for later!</p>
            <Link href="/products" className="inline-block bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group">
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                    )}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate mb-1">{item.name}</h3>
                    {item.genericName && (
                      <p className="text-xs text-gray-500 mb-2">{item.genericName}</p>
                    )}
                    
                    {item.rating && (
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {'★'.repeat(Math.floor(item.rating))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">({item.rating})</span>
                      </div>
                    )}

                    <div className="mb-3">
                      <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded mr-2">{item.strength}</span>
                      <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded">{item.form}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-gray-900">Rs{item.price}</span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className={`w-full py-2 rounded-lg font-semibold transition flex items-center justify-center space-x-2 ${
                        addedToCart === item.id
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{addedToCart === item.id ? 'Added!' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Wishlist Button */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear your wishlist?')) {
                    clearWishlist();
                  }
                }}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Clear Wishlist
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
