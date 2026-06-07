'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X, LogOut, Settings, MapPin, Tag, Truck, Heart, TrendingUp } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useHydration } from '@/lib/hooks/useHydration';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/lib/auth/context';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { getItemCount } = useCartStore();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const isHydrated = useHydration();

  const runSearch = () => {
    const q = query.trim();
    if (q.length === 0) return;
    router.push(`/products?q=${encodeURIComponent(q)}`);
    setShowSearchDropdown(false);
    setShowMobileSearch(false);
  };

  // Mock search suggestions
  const searchSuggestions = [
    'Pain Relief Medications',
    'Vitamins & Supplements',
    'Allergy Medicine',
    'Cold & Cough Syrup',
    'Antibiotics',
    'Skincare Products',
  ];

  const filteredSuggestions = query.trim() === '' 
    ? searchSuggestions 
    : searchSuggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()));

  return (
    <header className="sticky top-0 z-50">
      {/* Promo Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 text-center text-xs sm:text-sm font-medium">
        <div className="flex items-center justify-center space-x-2">
          <Truck className="w-4 h-4" />
          <span>Free Delivery on Orders Above Rs500 | Next-Day Delivery Available</span>
        </div>
      </div>

      {/* Top Info Bar */}
      <div className="bg-gray-900 text-gray-300 py-2 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-blue-400" />
              <span>Deliver to Pakistan</span>
            </div>
            <Link href="/vouchers" className="flex items-center space-x-1 hover:text-blue-400 transition">
              <Tag className="w-3 h-3" />
              <span>Today's Deals</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/orders" className="hover:text-blue-400 transition">My Orders</Link>
                <span>•</span>
                <Link href="/profile" className="hover:text-blue-400 transition">Account</Link>
              </>
            ) : (
              <>
                <Link href="/auth/signup" className="hover:text-blue-400 transition">Sign Up</Link>
                <span>•</span>
                <Link href="/auth/signin" className="hover:text-blue-400 transition">Login</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition">
                <span className="text-white font-black text-2xl">P</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xl font-black text-gray-900">Pharma Plus</span>
                <span className="text-xs text-gray-500 font-medium">Your Trusted Pharmacy</span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex items-center flex-1 max-w-2xl mx-6">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="text-gray-400 w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search medicines, vitamins, supplements..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') runSearch();
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-600 transition placeholder-gray-400"
                />
                
                {/* Search Dropdown */}
                {showSearchDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    <div className="p-2">
                      {filteredSuggestions.length > 0 ? (
                        <>
                          {filteredSuggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setQuery(suggestion);
                                router.push(`/products?q=${encodeURIComponent(suggestion)}`);
                                setShowSearchDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition"
                            >
                              <Search className="w-4 h-4 text-gray-400" />
                              <span>{suggestion}</span>
                            </button>
                          ))}
                          <button
                            onClick={runSearch}
                            disabled={query.trim() === ''}
                            className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 font-medium flex items-center justify-center space-x-2"
                          >
                            <Search className="w-4 h-4" />
                            <span>Search "{query}"</span>
                          </button>
                        </>
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">No suggestions found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Search Button */}
              <button
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition lg:hidden"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              >
                <Search className="w-6 h-6" />
              </button>
              
              {/* Wishlist */}
              <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition hidden md:flex items-center space-x-1">
                <Heart className="w-6 h-6" />
                <span className="text-sm font-medium hidden lg:inline">Wishlist</span>
              </button>

              {/* Cart */}
              <Link 
                href="/cart"
                className="flex items-center space-x-1 px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-lg transition relative group"
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 text-gray-700" />
                  {isHydrated && getItemCount() > 0 && (
                    <span className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                      {getItemCount()}
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-900 hidden md:inline">Cart</span>
                
                {/* Cart Hover Preview */}
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition p-4 hidden md:block z-50">
                  <p className="font-semibold text-gray-900 mb-2">Shopping Cart</p>
                  {isHydrated && getItemCount() > 0 ? (
                    <p className="text-sm text-gray-600 mb-3">{getItemCount()} items in cart</p>
                  ) : (
                    <p className="text-sm text-gray-500 mb-3">Your cart is empty</p>
                  )}
                  <Link href="/cart" className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center font-medium text-sm">
                    View Cart
                  </Link>
                </div>
              </Link>

              {/* Account */}
              <div className="relative hidden sm:block">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-1 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <User className="w-6 h-6" />
                  <span className="text-sm font-medium hidden lg:inline">Account</span>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                          <p className="text-sm font-bold text-gray-900">Welcome, {user?.name}</p>
                          <p className="text-xs text-gray-600">{user?.email}</p>
                        </div>
                        <div className="py-2">
                          <Link
                            href="/profile"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Settings className="w-4 h-4 mr-3 text-blue-600" />
                            <span>My Profile</span>
                          </Link>
                          <Link
                            href="/orders"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-3 text-blue-600" />
                            <span>My Orders</span>
                          </Link>
                          <Link
                            href="/prescriptions"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <TrendingUp className="w-4 h-4 mr-3 text-blue-600" />
                            <span>Prescriptions</span>
                          </Link>
                          <button
                            onClick={() => {
                              signOut();
                              setIsProfileOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition border-t border-gray-100"
                          >
                            <LogOut className="w-4 h-4 mr-3 text-red-600" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="py-4 px-4">
                        <div className="mb-4">
                          <p className="text-sm text-gray-700 mb-3 font-medium">New to Pharma Plus?</p>
                          <Link
                            href="/auth/signup"
                            className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition text-center text-sm"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Create Account
                          </Link>
                        </div>
                        <div className="border-t pt-4">
                          <p className="text-sm text-gray-600 mb-3 font-medium">Existing Customer?</p>
                          <Link
                            href="/auth/signin"
                            className="block text-blue-600 font-semibold hover:text-blue-700 transition text-center text-sm"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Sign In
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
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition sm:hidden"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {showMobileSearch && (
        <div className="bg-gray-50 p-4 border-b border-gray-200 lg:hidden">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search medicines..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') runSearch();
                }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
              />
            </div>
            <button
              onClick={runSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              GO
            </button>
          </div>
        </div>
      )}

      {/* Category Navigation Bar */}
      <div className="bg-white border-b border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6 h-12 overflow-x-auto">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition whitespace-nowrap font-medium text-sm">Home</Link>
            <Link href="/categories" className="text-gray-700 hover:text-blue-600 transition whitespace-nowrap font-medium text-sm">All Categories</Link>
            <Link href="/flash-deals" className="text-gray-700 hover:text-blue-600 transition whitespace-nowrap font-medium text-sm flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>Flash Deals</span>
            </Link>
            <Link href="/health-tips" className="text-gray-700 hover:text-blue-600 transition whitespace-nowrap font-medium text-sm">Health Tips</Link>
            <Link href="/prescriptions" className="text-gray-700 hover:text-blue-600 transition whitespace-nowrap font-medium text-sm">Upload Rx</Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-white border-t border-gray-200 sm:hidden">
          <div className="px-4 py-4 space-y-3">
            {isAuthenticated && (
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            )}
            
            <Link href="/" className="block py-2 text-gray-800 hover:text-blue-600 font-medium text-sm">Home</Link>
            <Link href="/categories" className="block py-2 text-gray-800 hover:text-blue-600 font-medium text-sm">All Categories</Link>
            <Link href="/flash-deals" className="block py-2 text-gray-800 hover:text-blue-600 font-medium text-sm">Flash Deals</Link>
            <Link href="/health-tips" className="block py-2 text-gray-800 hover:text-blue-600 font-medium text-sm">Health Tips</Link>
            
            {isAuthenticated && (
              <>
                <Link href="/orders" className="block py-2 text-gray-800 hover:text-blue-600 font-medium text-sm">My Orders</Link>
                <Link href="/profile" className="block py-2 text-gray-800 hover:text-blue-600 font-medium text-sm">My Account</Link>
                <Link href="/prescriptions" className="block py-2 text-gray-800 hover:text-blue-600 font-medium text-sm">My Prescriptions</Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="block py-2 text-red-600 hover:text-red-700 font-medium text-sm w-full text-left"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
