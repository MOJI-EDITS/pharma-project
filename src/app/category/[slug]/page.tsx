'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ProductGrid from '@/components/products/ProductGrid';
import { productsData } from '@/lib/data/products';
import { categorySlugMap } from '@/lib/categorySlugs';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const categoryName = categorySlugMap[slug] || slug.replace('-', ' ');
  
  const products = categoryName === 'Pharma Plus Mall' 
    ? productsData 
    : productsData.filter(product => product.category === categoryName);

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
          {categoryName}
        </h1>
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="bg-white rounded-sm p-8 text-center">
            <p className="text-gray-600">No products available in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
