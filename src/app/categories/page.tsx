import React, { useMemo } from 'react';
import Link from 'next/link';
import { productsData } from '@/lib/data/products';
import { categorySlugFromName } from '@/lib/categorySlugs';

export default function Categories() {
  const derivedCategories = useMemo(() => {
    const set = new Set(productsData.map(p => p.category));
    return Array.from(set).map(name => ({
      name,
      slug: categorySlugFromName(name),
    }));
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-gradient">Product Categories</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {derivedCategories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow hover:shadow-md border border-gray-100 dark:border-zinc-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-50">{cat.name}</h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
