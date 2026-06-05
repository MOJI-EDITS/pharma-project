'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PrescriptionFile {
  fileName: string;
  url: string;
  mimeType: string;
  size: number;
}

interface PrescriptionRecord {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  notes?: string;
  status: string;
  createdAt: string;
  files: PrescriptionFile[];
}

export default function PrescriptionHistoryPage() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch('/api/prescriptions/history');
        const data = await response.json();
        if (!response.ok) {
          setError(data?.error || 'Unable to load prescription history.');
          return;
        }
        setPrescriptions(data);
      } catch (err) {
        setError('Unable to load prescription history.');
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Your Prescription History</h1>
          <p className="mt-3 text-gray-600">
            Track the prescriptions you have uploaded and review the verification status.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm text-center">
            Loading your prescription history…
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 shadow-sm text-red-700">
            {error}
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm text-center">
            <p className="text-gray-700">No prescriptions found yet.</p>
            <Link href="/prescriptions" className="mt-4 inline-block rounded-full bg-[#2563eb] px-6 py-3 text-white hover:bg-[#1d4ed8]">
              Upload a Prescription
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {prescriptions.map((prescription) => (
              <div key={prescription._id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Uploaded on</p>
                    <p className="text-lg font-semibold text-gray-900">{new Date(prescription.createdAt).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Status: {prescription.status}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>{prescription.customerName}</p>
                    <p>{prescription.customerEmail}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <h2 className="text-sm font-semibold text-gray-900">Delivery Address</h2>
                    <p className="mt-3 text-sm text-gray-700">{prescription.shippingAddress}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <h2 className="text-sm font-semibold text-gray-900">Notes</h2>
                    <p className="mt-3 text-sm text-gray-700">{prescription.notes || 'No additional notes provided.'}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">Attached Files</p>
                    <p className="text-sm text-gray-500">{prescription.files.length} file(s)</p>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {prescription.files.map((file) => (
                      <li key={file.url} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4">
                        <div>
                          <p className="font-medium text-gray-900">{file.fileName}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB • {file.mimeType}</p>
                        </div>
                        <Link href={file.url} target="_blank" className="text-[#2563eb] hover:underline text-sm">
                          View
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
