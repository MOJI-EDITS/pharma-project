'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { productsData } from '@/lib/data/products';
import { useCartStore } from '@/lib/store/cartStore';

export default function ProductGrid() {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const { addItem } = useCartStore();

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
  };

  const featuredProducts = productsData.filter(product => product.isFeatured).slice(0, 8);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredProducts.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden group"
        >
          {/* Product Image */}
          <div className="relative h-48 bg-gray-100 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P+</span>
              </div>
            </div>
            
            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product._id)}
              className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${
                  wishlist.has(product._id)
                    ? 'text-red-500 fill-current'
                    : 'text-gray-400'
                }`}
              />
            </button>

            {/* Discount Badge */}
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {product.stockQuantity} in stock
              </span>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={() => addItem({
                id: product._id,
                name: product.name,
                price: product.price,
                strength: product.strength,
                form: product.form,
                isPrescription: product.isPrescription
              })}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            {/* Product Details */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{product.strength}</span>
                <span>{product.form}</span>
                <span className={`px-2 py-1 rounded-full ${
                  product.isPrescription 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {product.isPrescription ? 'Rx' : 'OTC'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}