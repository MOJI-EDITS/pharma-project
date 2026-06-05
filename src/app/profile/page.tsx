'use client';

import { useAuth } from '@/lib/auth/context';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <p className="text-gray-600 mb-4">You need to be signed in to view your profile.</p>
          <a
            href="/auth/signin"
            className="w-full bg-[#2563eb] text-white py-2 px-4 rounded-md hover:bg-[#1d4ed8] transition-colors block text-center"
          >
            Sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#2563eb] px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Profile</h1>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-lg text-gray-900">{user?.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-lg text-gray-900">{user?.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Role</label>
                    <p className="text-lg text-gray-900 capitalize">{user?.role}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">User ID</label>
                    <p className="text-sm text-gray-600 font-mono">{user?.id}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-400' : 'bg-gray-400'} mr-2`}></div>
                    <span className="text-sm text-gray-600">
                      {isAuthenticated ? 'Account is active' : 'Account is inactive'}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${isAdmin ? 'bg-purple-400' : 'bg-gray-400'} mr-2`}></div>
                    <span className="text-sm text-gray-600">
                      {isAdmin ? 'Administrator privileges' : 'Standard user account'}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                    <span className="text-sm text-gray-600">
                      Member since {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-md">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Notice</h3>
                  <p className="text-sm text-blue-700">
                    This is a demo authentication system. In a production environment, 
                    you would see order history, prescription details, and account settings here.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/products"
                  className="bg-white border border-gray-300 rounded-md px-4 py-3 text-center hover:bg-gray-50 transition-colors"
                >
                  <div className="text-[#2563eb] font-medium">Browse Products</div>
                  <div className="text-sm text-gray-500">Shop our catalog</div>
                </Link>
                
                <Link
                  href="/"
                  className="bg-white border border-gray-300 rounded-md px-4 py-3 text-center hover:bg-gray-50 transition-colors"
                >
                  <div className="text-[#2563eb] font-medium">View Cart</div>
                  <div className="text-sm text-gray-500">Check your items</div>
                </Link>
                
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="bg-white border border-gray-300 rounded-md px-4 py-3 text-center hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-purple-600 font-medium">Admin Panel</div>
                    <div className="text-sm text-gray-500">Manage products</div>
                  </Link>
                )}
                <Link
                  href="/prescriptions/history"
                  className="bg-white border border-gray-300 rounded-md px-4 py-3 text-center hover:bg-gray-50 transition-colors"
                >
                  <div className="text-[#2563eb] font-medium">Prescription History</div>
                  <div className="text-sm text-gray-500">View your prescription uploads</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}