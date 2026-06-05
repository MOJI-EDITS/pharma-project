"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';

interface UploadFile {
  name: string;
  size: number;
  type: string;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export default function Prescriptions() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fileList = useMemo(() => files.map((file) => ({ name: file.name, size: file.size, type: file.type })), [files]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;
    setErrorMessage('');
    setFiles(Array.from(selectedFiles));
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const dropped = Array.from(event.dataTransfer.files);
    setErrorMessage('');
    setFiles(dropped);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name || !email || !phone || !address) {
      setErrorMessage('Please complete all required fields before uploading.');
      return;
    }

    if (!files.length) {
      setErrorMessage('Please attach at least one prescription file.');
      return;
    }

    const invalidFile = files.find((file) => !ACCEPTED_TYPES.includes(file.type));
    if (invalidFile) {
      setErrorMessage('Only JPG, PNG, and PDF files are allowed.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('address', address);
      formData.append('notes', notes);
      files.forEach((file) => formData.append('files', file));

      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        setErrorMessage(result?.error || 'Upload failed. Please try again.');
      } else {
        setSuccessMessage(result.message || 'Prescription uploaded successfully.');
        setFiles([]);
        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setNotes('');
      }
    } catch (error) {
      setErrorMessage('Upload failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Prescription Upload</h1>
            <p className="mt-3 text-gray-600">
              Upload your prescription and our team will verify it before dispatching your medication. You can upload JPG, PNG, or PDF files.
            </p>
          </div>

          {successMessage ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-green-900 mb-6">
              {successMessage}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900 mb-6">
              {errorMessage}
            </div>
          ) : null}

          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Your full name"
                  className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#dbeafe]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#dbeafe]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  placeholder="+1 234 567 890"
                  className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#dbeafe]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                  placeholder="Street, city, state, postal code"
                  className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#dbeafe]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Prescription Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Any special instructions for our pharmacy team"
                className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#dbeafe]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Prescription</label>
              <div
                onDrop={onDrop}
                onDragOver={(event) => event.preventDefault()}
                className="mt-2 flex min-h-[180px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-slate-50 px-4 py-10 text-center transition hover:border-[#2563eb] hover:bg-slate-100"
              >
                <p className="text-sm text-gray-600">Drag and drop your prescription file(s) here, or click to browse.</p>
                <p className="text-sm text-gray-400 mt-1">Allowed formats: JPG, PNG, PDF</p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  multiple
                  onChange={onFileChange}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>
              {fileList.length > 0 ? (
                <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
                  <p className="text-sm font-semibold text-gray-900">Files ready to upload</p>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    {fileList.map((file) => (
                      <li key={`${file.name}-${file.size}`}>
                        {file.name} • {(file.size / 1024).toFixed(1)} KB • {file.type}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#2563eb] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-[#2563eb]/10 transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Uploading prescription…' : 'Submit Prescription'}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <p className="text-sm text-gray-500">Already uploaded a prescription?</p>
            <Link
              href="/prescriptions/history"
              className="rounded-full bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8]"
            >
              View Upload History
            </Link>
          </div>

          <div className="mt-8 rounded-3xl border border-gray-200 bg-[#f8fafc] p-6">
            <h2 className="text-xl font-semibold text-gray-900">How it works</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>1. Upload a clear image or PDF of your prescription.</li>
              <li>2. Our pharmacists verify your prescription.</li>
              <li>3. We prepare your medication and deliver to your address.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
