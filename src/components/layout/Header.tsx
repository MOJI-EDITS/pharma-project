'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X, LogOut, Settings, MapPin, Tag } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useHydration } from '@/lib/hooks/useHydration';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/lib/auth/context';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { getItemCount } = useCartStore();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const isHydrated = useHydration();

  const runSearch = () => {
    const q = query.trim();
    if (q.length === 0) return;
    router.push(`/products?q=${encodeURIComponent(q)}`);
    setShowMobileSearch(false);
  };



  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-[#f5f5f5] text-xs text-gray-600 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>Deliver to Pakistan</span>
            </div>
            <Link href="/vouchers" className="flex items-center space-x-1 hover:text-[#2563eb]">
              <Tag className="w-3 h-3" />
              <span>Vouchers</span>
            </Link>
            <Link href="/help" className="hover:text-[#2563eb]">Help Center</Link>
          </div>
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link href="/orders" className="hover:text-[#2563eb]">My Orders</Link>
                <Link href="/profile" className="hover:text-[#2563eb]">Account</Link>
              </>
            ) : (
              <>
                <Link href="/auth/signup" className="hover:text-[#2563eb]">Sign Up</Link>
                <Link href="/auth/signin" className="hover:text-[#2563eb]">Login</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-[#2563eb] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#2563eb] font-black text-xl">P</span>
              </div>
              <span className="text-2xl font-black text-white">Pharma Plus</span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex items-center space-x-2 flex-1 max-w-2xl mx-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search Pharma Plus"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') runSearch();
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-full focus:outline-none"
                />
              </div>
              <button
                onClick={runSearch}
                className="px-6 py-2 bg-white text-[#2563eb] rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                SEARCH
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button
                className="p-2 text-white hover:text-gray-200 transition-colors md:hidden"
                onClick={() => setShowMobileSearch((s) => !s)}
              >
                <Search className="w-5 h-5" />
              </button>
              
              <Link 
                href="/cart"
                className="flex items-center space-x-1 text-white hover:text-gray-200 transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium ml-1">Cart</span>
                {isHydrated && getItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-[#2563eb] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </Link>

              <div className="relative hidden md:block">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-1 text-white hover:text-gray-200 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Account</span>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl border border-gray-200 z-50">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                          <p className="text-sm font-bold text-gray-900">Hello, {user?.name}</p>
                        </div>
                        <div className="py-2">
                          <Link
                            href="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Settings className="w-4 h-4 mr-3" />
                            My Profile
                          </Link>
                          <Link
                            href="/orders"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-3" />
                            My Orders
                          </Link>
                          <button
                            onClick={() => {
                              signOut();
                              setIsProfileOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="py-4 px-4">
                        <div className="text-center mb-4">
                          <p className="text-sm text-gray-700 mb-2">New to Pharma Plus?</p>
                          <Link
                            href="/auth/signup"
                            className="block w-full bg-[#2563eb] text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Sign Up Now
                          </Link>
                        </div>
                        <div className="text-center border-t pt-4">
                          <p className="text-sm text-gray-600 mb-2">Existing User?</p>
                          <Link
                            href="/auth/signin"
                            className="block text-[#2563eb] font-semibold hover:underline"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Login
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-white hover:text-gray-200 transition-colors md:hidden"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>



      {/* Mobile Search */}
      {showMobileSearch && (
        <div className="bg-[#2563eb] p-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Pharma Plus"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') runSearch();
                }}
                className="w-full pl-10 pr-4 py-2 rounded-full focus:outline-none"
              />
            </div>
            <button
              onClick={runSearch}
              className="px-4 py-2 bg-white text-[#2563eb] rounded-full font-semibold"
            >
              GO
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="space-y-3">
              {isAuthenticated && (
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                  <div className="w-12 h-12 bg-[#2563eb] rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user?.name?.[0]}
              </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              )}
              
              <Link href="/" className="block py-2 text-gray-800 hover:text-[#2563eb] font-medium">
                Home
              </Link>
              <Link href="/categories" className="block py-2 text-gray-800 hover:text-[#2563eb] font-medium">
                All Categories
              </Link>
              <Link href="/flash-deals" className="block py-2 text-gray-800 hover:text-[#2563eb] font-medium">
                Flash Deals
              </Link>
              {isAuthenticated && (
                <>
                  <Link href="/orders" className="block py-2 text-gray-800 hover:text-[#2563eb] font-medium">
                    My Orders
                  </Link>
                  <Link href="/profile" className="block py-2 text-gray-800 hover:text-[#2563eb] font-medium">
                    My Account
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 text-gray-800 hover:text-[#2563eb] font-medium w-full text-left"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
