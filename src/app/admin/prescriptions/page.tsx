'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, CheckCircle2, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface PrescriptionItem {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  notes?: string;
  status: string;
  createdAt: string;
  files: Array<{ fileName: string; url: string; mimeType: string; size: number }>;
}

export default function AdminPrescriptionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    async function loadPrescriptions() {
      try {
        const response = await fetch('/api/admin/prescriptions');
        const data = await response.json();
        if (!response.ok) {
          setError(data?.error || 'Failed to load prescriptions.');
          return;
        }
        setPrescriptions(data);
      } catch (err) {
        setError('Failed to load prescriptions.');
      } finally {
        setLoading(false);
      }
    }

    loadPrescriptions();
  }, [session, status, router]);

  const updateStatus = async (id: string, statusValue: string) => {
    try {
      const response = await fetch(`/api/admin/prescriptions?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusValue }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data?.error || 'Unable to update status.');
        return;
      }
      setPrescriptions((current) => current.map((prescription) => prescription._id === id ? data : prescription));
    } catch (err) {
      alert('Unable to update status.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <p className="text-sm text-gray-500">Admin / Prescriptions</p>
            <h1 className="text-3xl font-bold text-gray-900">Prescription Upload Review</h1>
          </div>
          <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <ChevronRight className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm text-center">
            <p className="text-gray-700">Loading prescription uploads…</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 shadow-sm text-center text-red-700">
            {error}
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm text-center">
            <p className="text-gray-700">No prescription uploads found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {prescriptions.map((prescription) => (
              <div key={prescription._id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Uploaded</p>
                    <p className="text-lg font-semibold text-gray-900">{new Date(prescription.createdAt).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{prescription.customerName} • {prescription.customerEmail}</p>
                    <p className="text-sm text-gray-500">{prescription.customerPhone}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${prescription.status === 'verified' ? 'bg-green-100 text-green-800' : prescription.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      <Clock className="mr-2 h-4 w-4" />{prescription.status}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <h3 className="text-sm font-semibold text-gray-900">Shipping Address</h3>
                    <p className="text-sm text-gray-600 mt-2">{prescription.shippingAddress}</p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 lg:col-span-2">
                    <h3 className="text-sm font-semibold text-gray-900">Files</h3>
                    <ul className="mt-3 space-y-2 text-sm text-gray-700">
                      {prescription.files.map((file) => (
                        <li key={file.url} className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 border border-gray-200">
                          <span>{file.fileName}</span>
                          <a href={file.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            View
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => updateStatus(prescription._id, 'verified')}
                    className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => updateStatus(prescription._id, 'rejected')}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => updateStatus(prescription._id, 'pending')}
                    className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600"
                  >
                    Set Pending
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
