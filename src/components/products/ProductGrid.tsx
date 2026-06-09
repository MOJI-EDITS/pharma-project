'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, Truck } from 'lucide-react';
import { productsData } from '@/lib/data/products';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useToastStore } from '@/lib/store/toastStore';
import { IProduct } from '@/lib/types/Product';

export default function ProductGrid({ products, variant = 'catalog' }: { products?: IProduct[]; variant?: 'featured' | 'catalog' | 'flash' }) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToast } = useToastStore();
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const handleAddToCart = (e: React.MouseEvent, product: IProduct) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add to cart
    addItem({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      strength: product.strength,
      form: product.form,
      isPrescription: product.isPrescription
    });

    // Show toast notification
    addToast({
      message: 'Added to cart successfully!',
      productName: product.name,
      type: 'success',
      duration: 3000,
    });

    // Show button animation
    setAddedToCart(product._id.toString());
    setTimeout(() => setAddedToCart(null), 2000);
  };

  const toggleItemWishlist = (e: React.MouseEvent, product: IProduct) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      strength: product.strength,
      form: product.form,
      genericName: product.genericName,
      rating: product.rating,
      category: product.category,
    });
  };

  const displayProducts = products || productsData.filter(product => product.featured).slice(0, 8);

  const gridCols = variant === 'flash' 
    ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' 
    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5';

  return (
    <div className={`grid ${gridCols} gap-3`}>
      {displayProducts.map((product) => (
        <Link
          key={product._id.toString()}
          href={`/products/${product._id}`}
          className="bg-white rounded-sm overflow-hidden hover:shadow-lg transition-all duration-200 group border border-gray-100"
        >
          <div className="relative aspect-square bg-gray-100 overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(min-width:1024px) 20vw, (min-width:768px) 33vw, 50vw"
                priority={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 bg-[#2563eb] rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
              </div>
            )}
            
            {/* Discount Badge */}
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="absolute top-2 left-2 bg-[#2563eb] text-white px-1.5 py-0.5 rounded text-xs font-bold">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </div>
            )}
            
            {/* Mall Badge */}
            {product.featured && (
              <div className="absolute top-2 right-2 bg-[#ce0000] text-white px-1.5 py-0.5 rounded text-xs font-bold">
                Pharma Plus Mall
              </div>
            )}
            
            {/* Wishlist */}
            <button
              onClick={(e) => toggleItemWishlist(e, product)}
              className="absolute bottom-2 right-2 p-1.5 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95"
              title={isInWishlist(product._id.toString()) ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={`w-4 h-4 transition-all ${
                  isInWishlist(product._id.toString())
                    ? 'text-red-500 fill-current'
                    : 'text-gray-400 hover:text-red-500'
                }`}
              />
            </button>

            {/* Add to Cart Button - Visible on hover with animation */}
            <button
              onClick={(e) => handleAddToCart(e, product)}
              className={`absolute bottom-2 left-2 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 ${
                addedToCart === product._id.toString()
                  ? 'bg-green-500 text-white animate-bounce'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg'
              }`}
              title="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>

          <div className="p-2.5">
            {/* Product Name */}
            <h3 className="text-xs text-gray-800 mb-1.5 line-clamp-2 leading-4 group-hover:text-[#2563eb] transition-colors">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-baseline space-x-1.5 mb-1.5">
              <span className="text-[#2563eb] font-bold text-sm">
                Rs.{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  Rs.{product.originalPrice}
                </span>
              )}
            </div>

            {/* Rating & Sold */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                  key={i}
                  className={`w-2.5 h-2.5 ${
                    i < Math.floor(product.rating || 4)
                      ? 'text-[#facc15] fill-current'
                      : 'text-gray-300'
                  }`}
                />
                ))}
                <span className="text-[10px] text-gray-500 ml-0.5">
                  {product.reviewCount || 0}
                </span>
              </div>
              {product.stockQuantity && (
                <span className="text-[10px] text-gray-400">
                  {product._id.toString().length * 42 + 100} Sold
                </span>
              )}
            </div>

            {/* Shipping Info */}
            <div className="flex items-center text-[10px] text-gray-500">
              <Truck className="w-3 h-3 mr-1" />
              <span>Free Shipping</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
