'use client';
import Link from "next/link";
import ProductGrid from "@/components/products/ProductGrid";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import type { IProduct } from "@/lib/types/Product";
import { ChevronRight, ChevronLeft, Zap, Heart, Truck } from "lucide-react";

const categories = [
  { name: "Pharma Plus Mall", icon: "🛍️", slug: "mall" },
  { name: "Medicines", icon: "💊", slug: "medicines" },
  { name: "Health & Wellness", icon: "❤️", slug: "health" },
  { name: "Personal Care", icon: "🧴", slug: "personal-care" },
  { name: "Vitamins & Supplements", icon: "💪", slug: "vitamins" },
  { name: "Medical Devices", icon: "🩺", slug: "medical-devices" },
  { name: "Baby Care", icon: "👶", slug: "baby-care" },
  { name: "Skin Care", icon: "✨", slug: "skin-care" },
  { name: "Oral Care", icon: "🦷", slug: "oral-care" },
  { name: "First Aid", icon: "🩹", slug: "first-aid" },
  { name: "Sexual Wellness", icon: "❤️", slug: "sexual-wellness" },
  { name: "Vouchers", icon: "🎁", slug: "vouchers" },
];

export default function Home() {
  const [products, setProducts] = useState<IProduct[] | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

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
    return () => { active = false; };
  }, []);

  const heroSlides = [
    { id: 1, color: "from-blue-600 to-blue-800", title: "Big Sale - Up to 80% Off!" },
    { id: 2, color: "from-blue-500 to-cyan-500", title: "Free Shipping on All Orders" },
    { id: 3, color: "from-blue-700 to-indigo-600", title: "New Arrivals - Check Now!" },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const featuredProducts = products ? products.filter(p => p.featured).slice(0, 10) : undefined;
  const flashProducts = products ? products.slice(0, 12) : undefined;
  const bestSellers = products ? products.slice(12, 24) : undefined;
  const newArrivals = products ? products.slice(24, 36) : undefined;
  const topRated = products ? products.slice(36, 48) : undefined;
  const medicines = products ? products.filter(p => p.category?.includes('Medicines') || p.category?.includes('Antibiotics') || p.category?.includes('Pain Relief')).slice(0, 12) : undefined;
  const vitamins = products ? products.filter(p => p.category?.includes('Vitamins') || p.category?.includes('Supplements')).slice(0, 12) : undefined;
  const wellness = products ? products.filter(p => p.category?.includes('Health') || p.category?.includes('Medical')).slice(0, 12) : undefined;

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Hero Carousel */}
      <section className="relative overflow-hidden">
        <div 
          ref={carouselRef}
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroSlides.map((slide) => (
            <div 
              key={slide.id} 
              className={`min-w-full h-[280px] md:h-[380px] bg-gradient-to-r ${slide.color} flex items-center justify-center`}
            >
              <div className="text-center text-white">
                <h2 className="text-3xl md:text-5xl font-black mb-4">{slide.title}</h2>
                <Link href="/products" className="inline-block bg-white text-[#2563eb] px-8 py-3 rounded font-bold hover:bg-gray-100 transition-colors">
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4">
        {/* Categories Section */}
        <section className="bg-white rounded-sm p-4 mb-4">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center p-3 hover:bg-gray-50 rounded transition-colors group"
              >
                <span className="text-3xl mb-2">{cat.icon}</span>
                <span className="text-[11px] text-gray-700 text-center group-hover:text-[#2563eb] transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Flash Deals Section */}
        <section className="bg-white rounded-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-[#2563eb] fill-[#2563eb]" />
              <h2 className="text-lg font-bold text-gray-900">Flash Deals</h2>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <span className="bg-gray-800 text-white px-2 py-0.5 rounded font-mono">23</span>
                <span>:</span>
                <span className="bg-gray-800 text-white px-2 py-0.5 rounded font-mono">45</span>
                <span>:</span>
                <span className="bg-gray-800 text-white px-2 py-0.5 rounded font-mono">30</span>
              </div>
            </div>
            <Link href="/flash-deals" className="flex items-center space-x-1 text-[#2563eb] font-medium hover:underline">
              <span>See All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={flashProducts} variant="flash" />
        </section>

        {/* Mall Section */}
        <section className="bg-white rounded-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#ce0000] rounded flex items-center justify-center text-white font-bold text-sm">
                P
              </div>
              <h2 className="text-lg font-bold text-gray-900">Pharma Plus Mall</h2>
              <span className="bg-[#ce0000] text-white text-xs px-2 py-0.5 rounded">Authentic</span>
            </div>
            <Link href="/category/mall" className="flex items-center space-x-1 text-[#2563eb] font-medium hover:underline">
              <span>See All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} variant="catalog" />
        </section>

        {/* Just For You */}
        <section className="bg-white rounded-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Best Sellers</h2>
            <Link href="/products" className="flex items-center space-x-1 text-[#2563eb] font-medium hover:underline">
              <span>See All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={bestSellers} variant="catalog" />
        </section>

        {/* New Arrivals */}
        <section className="bg-white rounded-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✨</span>
              <h2 className="text-lg font-bold text-gray-900">New Arrivals</h2>
              <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded">New</span>
            </div>
            <Link href="/products" className="flex items-center space-x-1 text-[#2563eb] font-medium hover:underline">
              <span>See All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={newArrivals} variant="catalog" />
        </section>

        {/* Medicines & Treatments */}
        <section className="bg-white rounded-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💊</span>
              <h2 className="text-lg font-bold text-gray-900">Medicines & Treatments</h2>
            </div>
            <Link href="/category/medicines" className="flex items-center space-x-1 text-[#2563eb] font-medium hover:underline">
              <span>See All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={medicines} variant="catalog" />
        </section>

        {/* Vitamins & Supplements */}
        <section className="bg-white rounded-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💪</span>
              <h2 className="text-lg font-bold text-gray-900">Vitamins & Supplements</h2>
            </div>
            <Link href="/category/vitamins" className="flex items-center space-x-1 text-[#2563eb] font-medium hover:underline">
              <span>See All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={vitamins} variant="catalog" />
        </section>

        {/* Health & Medical Devices */}
        <section className="bg-white rounded-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🩺</span>
              <h2 className="text-lg font-bold text-gray-900">Health & Medical Devices</h2>
            </div>
            <Link href="/category/medical-devices" className="flex items-center space-x-1 text-[#2563eb] font-medium hover:underline">
              <span>See All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={wellness} variant="catalog" />
        </section>

        {/* Top Rated */}
        <section className="bg-white rounded-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⭐</span>
              <h2 className="text-lg font-bold text-gray-900">Top Rated</h2>
            </div>
            <Link href="/products" className="flex items-center space-x-1 text-[#2563eb] font-medium hover:underline">
              <span>See All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={topRated} variant="catalog" />
        </section>

        {/* All Products */}
        <section className="bg-white rounded-sm p-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Explore All Products</h2>
            <Link href="/products" className="flex items-center space-x-1 text-[#2563eb] font-medium hover:underline">
              <span>See All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={products?.slice(48, 60)} variant="catalog" />
        </section>
      </main>
    </div>
  );
}
