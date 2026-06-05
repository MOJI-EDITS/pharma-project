'use client';

import ProductGrid from '@/components/products/ProductGrid';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { productsData } from '@/lib/data/products';
import { Filter, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);
  const [prescriptionType, setPrescriptionType] = useState<'all' | 'prescription' | 'otc'>('all');
  const [products, setProducts] = useState(productsData.map(p => ({ ...p, images: [] })));

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (active && Array.isArray(data)) {
          setProducts(data);
        }
      } catch {
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    
    const matchesPrice = p.price >= priceRange.min && p.price <= priceRange.max;
    
    const matchesPrescription = 
      prescriptionType === 'all' ? true :
      prescriptionType === 'prescription' ? p.isPrescription :
      !p.isPrescription;

    return matchesSearch && matchesCategory && matchesPrice && matchesPrescription;
  });

  const prescriptionTypes = [
    { value: 'all', label: 'All Products' },
    { value: 'otc', label: 'Over the Counter (OTC)' },
    { value: 'prescription', label: 'Prescription Only' }
  ] as const;

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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden flex items-center justify-center space-x-2 w-full p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>

          {/* Filters Sidebar */}
          <div className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input 
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex items-center space-x-2 mb-2">
                  <input 
                    type="number" 
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Min"
                  />
                  <span className="text-gray-400">-</span>
                  <input 
                    type="number" 
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Prescription Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div className="space-y-2">
                  {prescriptionTypes.map((type) => (
                    <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="type"
                        checked={prescriptionType === type.value}
                        onChange={() => setPrescriptionType(type.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-gray-500">
              Showing {filteredProducts.length} results
            </div>
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setPriceRange({ min: 0, max: 1000 });
                    setPrescriptionType('all');
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
