import ProductGrid from '@/components/products/ProductGrid';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
          <p className="text-gray-600">
            Browse our complete catalog of pharmaceutical products and healthcare solutions
          </p>
        </div>

        {/* Products Grid */}
        <ProductGrid />
      </div>
    </div>
  );
}