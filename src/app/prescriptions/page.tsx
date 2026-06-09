'use client';

import { useState, useEffect } from 'react';
import { Clock, Download, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface PrescriptionItem {
  medicineId: string;
  medicineName: string;
  strength: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  notes?: string;
}

interface Prescription {
  id: string;
  userId: string;
  symptoms: string[];
  medicines: PrescriptionItem[];
  doctorNotes?: string;
  aiRecommended: boolean;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: number;
  expiryDate?: number;
  refillsRemaining: number;
}

export default function PrescriptionsPage() {
  const { data: session, status } = useSession();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/auth/signin';
      return;
    }

    if (status === 'authenticated') {
      fetchPrescriptions();
    }
  }, [status]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prescriptions');
      const data = await response.json();

      if (response.ok) {
        setPrescriptions(data.prescriptions || []);
      } else {
        setError(data.error || 'Failed to fetch prescriptions');
      }
    } catch (err) {
      setError('Error fetching prescriptions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isExpired = (expiryDate?: number) => {
    return expiryDate && expiryDate < Date.now();
  };

  const filteredPrescriptions = prescriptions.filter(rx => {
    if (filter === 'all') return true;
    return rx.status === filter;
  });

  const statusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💊 My Prescriptions</h1>
          <p className="text-lg text-gray-600">Manage and view your prescription history</p>
        </div>

        {/* Navigation */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {(['all', 'active', 'completed', 'cancelled'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
              }`}
            >
              {f === 'all' && `All (${prescriptions.length})`}
              {f === 'active' && `Active (${prescriptions.filter(r => r.status === 'active').length})`}
              {f === 'completed' && `Completed (${prescriptions.filter(r => r.status === 'completed').length})`}
              {f === 'cancelled' && `Cancelled (${prescriptions.filter(r => r.status === 'cancelled').length})`}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredPrescriptions.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Prescriptions Found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? 'You have no prescriptions yet. Use the AI Pharmacist to get medicine recommendations based on your symptoms.'
                : `You have no ${filter} prescriptions.`}
            </p>
            <Link href="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Get Medicine Recommendations
            </Link>
          </div>
        )}

        {/* Prescriptions List */}
        <div className="space-y-6">
          {filteredPrescriptions.map(prescription => (
            <div key={prescription.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-200 flex justify-between items-start">
                <div className="flex items-start gap-3">
                  {statusIcon(prescription.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Prescription #{prescription.id.slice(-6).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(prescription.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    prescription.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : prescription.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {prescription.status === 'active' ? '✓ Active' : prescription.status === 'completed' ? '✓ Completed' : '✗ Cancelled'}
                  </span>
                  {prescription.aiRecommended && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      🤖 AI Recommended
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-4">
                {/* Symptoms */}
                {prescription.symptoms.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Reported Symptoms:</h4>
                    <div className="flex flex-wrap gap-2">
                      {prescription.symptoms.map((symptom, idx) => (
                        <span key={idx} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medicines */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Prescribed Medicines ({prescription.medicines.length})</h4>
                  <div className="space-y-3">
                    {prescription.medicines.map((medicine, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{medicine.medicineName}</p>
                            <p className="text-sm text-gray-600">{medicine.strength}</p>
                          </div>
                          <p className="font-bold text-green-600">Qty: {medicine.quantity}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Dosage</p>
                            <p className="font-medium text-gray-900">{medicine.dosage}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Frequency</p>
                            <p className="font-medium text-gray-900">{medicine.frequency}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Duration</p>
                            <p className="font-medium text-gray-900">{medicine.duration}</p>
                          </div>
                        </div>
                        {medicine.notes && (
                          <p className="text-sm text-gray-600 mt-2 pt-2 border-t border-green-200">
                            <strong>Notes:</strong> {medicine.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Doctor Notes */}
                {prescription.doctorNotes && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Doctor Notes:</h4>
                    <p className="text-gray-700 bg-yellow-50 p-3 rounded border border-yellow-200">
                      {prescription.doctorNotes}
                    </p>
                  </div>
                )}

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {prescription.expiryDate && (
                    <div>
                      <p className="text-gray-600">Expiry Date</p>
                      <p className={`font-medium ${isExpired(prescription.expiryDate) ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatDate(prescription.expiryDate)}
                        {isExpired(prescription.expiryDate) && ' (Expired)'}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600">Refills Remaining</p>
                    <p className="font-medium text-gray-900">{prescription.refillsRemaining}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  ID: {prescription.id}
                </p>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Download Prescription
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
