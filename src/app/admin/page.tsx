'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Package, Users, ShoppingBag, BarChart, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">124</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
              <ShoppingBag className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">45</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">1,234</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
              <BarChart className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">Rs12,345</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            href="/admin/products"
            className="block p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Products</h3>
                <p className="text-gray-500">Add, edit, or remove products from the catalog</p>
              </div>
            </div>
          </Link>

          <Link 
            href="/admin/orders"
            className="block p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Orders</h3>
                <p className="text-gray-500">View and process customer orders</p>
              </div>
            </div>
          </Link>

          <Link 
            href="/admin/prescriptions"
            className="block p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-colors">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Review Prescriptions</h3>
                <p className="text-gray-500">Approve or reject uploaded prescriptions</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
