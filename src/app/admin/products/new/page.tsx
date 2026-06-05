'use client';

export const dynamic = 'force-static';

import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Product</h1>
        <ProductForm />
      </div>
    </div>
  );
}
