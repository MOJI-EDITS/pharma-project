'use client';

import { useParams } from 'next/navigation';
import { Star, ShoppingCart, Truck, Shield, Clock } from 'lucide-react';
import { getProductById } from '@/lib/data/products';
import { useCartStore } from '@/lib/store/cartStore';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { IProduct } from '@/lib/types/Product';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<IProduct | undefined>(() => {
    const base = getProductById(productId);
    return base ? { ...base, images: [] } : base;
  });
  const { addItem } = useCartStore();

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/products?id=${encodeURIComponent(productId)}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (active) {
          setProduct(data);
        }
      } catch {
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>Home</li>
            <li>/</li>
            <li>Products</li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-full h-80 rounded-lg overflow-hidden bg-gray-100 relative">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(min-width:1024px) 50vw, 100vw"
                  priority={false}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">P+</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 ml-2">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  Rs{product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    Rs{product.originalPrice}
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Save Rs{(product.originalPrice - product.price).toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {product.stockQuantity} in stock
              </span>
            </div>

            {/* Add to Cart */}
            <div className="mb-6">
              <button
                onClick={() =>
                  addItem({
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    strength: product.strength,
                    form: product.form,
                    isPrescription: product.isPrescription,
                    image: product.images?.[0],
                  })
                }
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-semibold"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Strength</div>
                <div className="font-semibold text-gray-900">{product.strength}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Form</div>
                <div className="font-semibold text-gray-900">{product.form}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Category</div>
                <div className="font-semibold text-gray-900">{product.category}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Type</div>
                <div className={`font-semibold ${
                  product.isPrescription ? 'text-red-600' : 'text-green-600'
                }`}>
                  {product.isPrescription ? 'Prescription' : 'Over-the-Counter'}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <Truck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Fast Delivery</div>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Quality Guaranteed</div>
              </div>
              <div className="text-center">
                <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">24/7 Support</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md">
          <Tabs product={product} />
        </div>
      </div>
    </div>
  );
}

function Tabs({ product }: { product: IProduct }) {
  const [active, setActive] = useState<'description' | 'dosage' | 'sideEffects' | 'precautions'>('description');

  return (
    <>
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            className={`py-4 px-2 font-semibold ${active === 'description' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActive('description')}
          >
            Description
          </button>
          <button
            className={`py-4 px-2 font-semibold ${active === 'dosage' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActive('dosage')}
          >
            Dosage Instructions
          </button>
          <button
            className={`py-4 px-2 font-semibold ${active === 'sideEffects' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActive('sideEffects')}
          >
            Side Effects
          </button>
          <button
            className={`py-4 px-2 font-semibold ${active === 'precautions' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActive('precautions')}
          >
            Precautions
          </button>
        </nav>
      </div>

      <div className="p-6">
        {active === 'description' && (
          <>
            <h3 className="text-lg font-semibold mb-4">Product Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Key Benefits</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Fast-acting formula for quick relief</li>
                  <li>• Clinically tested and proven effective</li>
                  <li>• Trusted by healthcare professionals</li>
                  <li>• Easy-to-use {product.form.toLowerCase()} form</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Active Ingredients</h4>
                <ul className="text-gray-600 space-y-1">
                  {product.activeIngredients?.map((ingredient, index) => (
                    <li key={index}>
                      • {ingredient.name} {ingredient.strength}
                    </li>
                  )) || (
                    <li>No ingredient information available</li>
                  )}
                </ul>
              </div>
            </div>
          </>
        )}

        {active === 'dosage' && (
          <>
            <h3 className="text-lg font-semibold mb-4">Dosage Instructions</h3>
            <p className="text-gray-700 leading-relaxed">{product.dosageInstructions}</p>
          </>
        )}

        {active === 'sideEffects' && (
          <>
            <h3 className="text-lg font-semibold mb-4">Side Effects</h3>
            <ul className="text-gray-700 space-y-1">
              {(product.sideEffects && product.sideEffects.length > 0 ? product.sideEffects : ['Information not available']).map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </>
        )}

        {active === 'precautions' && (
          <>
            <h3 className="text-lg font-semibold mb-4">Precautions</h3>
            <ul className="text-gray-700 space-y-1">
              {(product.precautions && product.precautions.length > 0 ? product.precautions : ['Follow healthcare professional guidance']).map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
