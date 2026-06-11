'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, LogOut, AlertCircle, CheckCircle, Package, Truck, MapPin as Location, X } from 'lucide-react';

// Fake orders data
const FAKE_ORDERS = [
  {
    id: 'ORD-2025001',
    date: '2025-12-01',
    items: ['Aspirin', 'Vitamin C', 'Cough Syrup'],
    total: 1299,
    status: 'Delivered',
    statusColor: 'green',
    tracking: {
      ordered: true,
      shipped: true,
      outForDelivery: true,
      delivered: true,
    },
    currentLocation: 'Delivered to Karachi',
    estimatedDelivery: 'Delivered on Dec 3, 2025',
  },
  {
    id: 'ORD-2025002',
    date: '2025-12-10',
    items: ['Paracetamol', 'Multivitamin'],
    total: 899,
    status: 'Out for Delivery',
    statusColor: 'blue',
    tracking: {
      ordered: true,
      shipped: true,
      outForDelivery: true,
      delivered: false,
    },
    currentLocation: 'In transit to Lahore',
    estimatedDelivery: 'Today by 6 PM',
  },
  {
    id: 'ORD-2025003',
    date: '2025-12-15',
    items: ['Antibiotic Cream', 'Bandages', 'First Aid Kit'],
    total: 2499,
    status: 'Processing',
    statusColor: 'yellow',
    tracking: {
      ordered: true,
      shipped: false,
      outForDelivery: false,
      delivered: false,
    },
    currentLocation: 'Being prepared for shipment',
    estimatedDelivery: 'Expected Dec 18, 2025',
  },
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showTrackOrder, setShowTrackOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: (session.user as any).phone || '',
        address: (session.user as any).address || '',
      });
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(data?.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563eb] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowTrackOrder(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Package className="h-5 w-5" />
              Track Orders
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>{success}</div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {/* User Info Header */}
          <div className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-[#2563eb]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{session.user.name}</h2>
                <p className="text-blue-100">{session.user.email}</p>
                {(session.user as any).role === 'admin' && (
                  <span className="inline-block mt-2 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-full">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6">
            {!isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <p className="text-gray-900 text-lg">{formData.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900 text-lg flex items-center gap-2">
                      {formData.email}
                      {session.user.email && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Verified
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <p className="text-gray-900 text-lg">
                      {formData.phone || <span className="text-gray-400">Not provided</span>}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <p className="text-gray-900 text-lg">
                      {formData.address || <span className="text-gray-400">Not provided</span>}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-6 px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-[#2563eb] focus:border-[#2563eb]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-[#2563eb] focus:border-[#2563eb]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your address"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-[#2563eb] focus:border-[#2563eb]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Account Information</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Account status: <span className="font-semibold text-green-600">Active</span></li>
            <li>• Role: <span className="font-semibold capitalize">{(session.user as any).role || 'User'}</span></li>
          </ul>
        </div>

        {/* Track Order Modal */}
        {showTrackOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Package className="h-6 w-6" />
                  Track My Orders
                </h2>
                <button
                  onClick={() => {
                    setShowTrackOrder(false);
                    setSelectedOrder(null);
                  }}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {!selectedOrder ? (
                  // Orders List
                  <div className="space-y-4">
                    <p className="text-gray-600 mb-4">Click on any order to view tracking details</p>
                    {FAKE_ORDERS.map((order) => (
                      <button
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-[#2563eb] hover:bg-blue-50 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{order.id}</h3>
                            <p className="text-sm text-gray-600 mt-1">Ordered: {order.date}</p>
                            <p className="text-sm text-gray-600">
                              {order.items.length} item{order.items.length > 1 ? 's' : ''}: {order.items.slice(0, 2).join(', ')}{order.items.length > 2 ? '...' : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-900">Rs{order.total}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                              order.statusColor === 'green'
                                ? 'bg-green-100 text-green-800'
                                : order.statusColor === 'blue'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  // Order Details with Tracking
                  <div className="space-y-6">
                    {/* Back Button */}
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-[#2563eb] hover:text-[#1d4ed8] font-medium flex items-center gap-2"
                    >
                      ← Back to Orders
                    </button>

                    {/* Order Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{selectedOrder.id}</h3>
                          <p className="text-gray-600 mt-1">Ordered on {selectedOrder.date}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full font-semibold ${
                          selectedOrder.statusColor === 'green'
                            ? 'bg-green-100 text-green-800'
                            : selectedOrder.statusColor === 'blue'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                    </div>

                    {/* Tracking Timeline */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 text-lg">Tracking Progress</h4>
                      <div className="space-y-4">
                        {/* Ordered */}
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              selectedOrder.tracking.ordered ? 'bg-green-100' : 'bg-gray-200'
                            }`}>
                              <CheckCircle className={`h-6 w-6 ${
                                selectedOrder.tracking.ordered ? 'text-green-600' : 'text-gray-400'
                              }`} />
                            </div>
                            {(selectedOrder.tracking.shipped || selectedOrder.tracking.outForDelivery || selectedOrder.tracking.delivered) && (
                              <div className={`w-1 h-12 ${
                                selectedOrder.tracking.shipped ? 'bg-green-600' : 'bg-gray-300'
                              }`}></div>
                            )}
                          </div>
                          <div className="pt-2">
                            <h5 className="font-semibold text-gray-900">Order Placed</h5>
                            <p className="text-sm text-gray-600 mt-1">Your order has been confirmed</p>
                          </div>
                        </div>

                        {/* Shipped */}
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              selectedOrder.tracking.shipped ? 'bg-blue-100' : 'bg-gray-200'
                            }`}>
                              <Truck className={`h-6 w-6 ${
                                selectedOrder.tracking.shipped ? 'text-blue-600' : 'text-gray-400'
                              }`} />
                            </div>
                            {(selectedOrder.tracking.outForDelivery || selectedOrder.tracking.delivered) && (
                              <div className={`w-1 h-12 ${
                                selectedOrder.tracking.outForDelivery ? 'bg-green-600' : 'bg-gray-300'
                              }`}></div>
                            )}
                          </div>
                          <div className="pt-2">
                            <h5 className="font-semibold text-gray-900">Shipped</h5>
                            <p className="text-sm text-gray-600 mt-1">Package is on its way to you</p>
                          </div>
                        </div>

                        {/* Out for Delivery */}
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              selectedOrder.tracking.outForDelivery ? 'bg-blue-100' : 'bg-gray-200'
                            }`}>
                              <Location className={`h-6 w-6 ${
                                selectedOrder.tracking.outForDelivery ? 'text-blue-600' : 'text-gray-400'
                              }`} />
                            </div>
                            {selectedOrder.tracking.delivered && (
                              <div className={`w-1 h-12 ${
                                selectedOrder.tracking.delivered ? 'bg-green-600' : 'bg-gray-300'
                              }`}></div>
                            )}
                          </div>
                          <div className="pt-2">
                            <h5 className="font-semibold text-gray-900">Out for Delivery</h5>
                            <p className="text-sm text-gray-600 mt-1">Your package is in final delivery</p>
                          </div>
                        </div>

                        {/* Delivered */}
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              selectedOrder.tracking.delivered ? 'bg-green-100' : 'bg-gray-200'
                            }`}>
                              <CheckCircle className={`h-6 w-6 ${
                                selectedOrder.tracking.delivered ? 'text-green-600' : 'text-gray-400'
                              }`} />
                            </div>
                          </div>
                          <div className="pt-2">
                            <h5 className="font-semibold text-gray-900">Delivered</h5>
                            <p className="text-sm text-gray-600 mt-1">Order completed successfully</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Current Location */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-600 font-medium">Current Location</p>
                      <p className="text-gray-900 font-semibold mt-1">{selectedOrder.currentLocation}</p>
                      <p className="text-sm text-gray-600 mt-2">{selectedOrder.estimatedDelivery}</p>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Items in this Order</h4>
                      <ul className="space-y-2">
                        {selectedOrder.items.map((item: string, index: number) => (
                          <li key={index} className="flex items-center gap-2 text-gray-700">
                            <span className="w-2 h-2 bg-[#2563eb] rounded-full"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Order Total:</span>
                        <span className="text-2xl font-bold text-[#2563eb]">Rs{selectedOrder.total}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}