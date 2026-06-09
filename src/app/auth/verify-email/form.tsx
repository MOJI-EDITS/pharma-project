'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          setTimeout(() => {
            router.push('/auth/signin');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to verify email');
        }
      } catch (err) {
        setStatus('error');
        setMessage('An error occurred. Please try again.');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-12 w-12 bg-[#2563eb] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Verify your email
          </h2>
        </div>

        {status === 'loading' && (
          <div className="py-8">
            <Loader className="h-12 w-12 text-[#2563eb] mx-auto animate-spin" />
            <p className="mt-4 text-gray-600">Verifying your email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Email verified!</h3>
              <p className="mt-2 text-gray-600">{message}</p>
            </div>
            <p className="text-sm text-gray-500">Redirecting to sign in...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="py-8 space-y-4">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Verification failed</h3>
              <p className="mt-2 text-gray-600">{message}</p>
            </div>
            <div className="space-y-2">
              <Link href="/auth/signup" className="block text-sm text-[#2563eb] hover:text-[#1d4ed8]">
                Create new account
              </Link>
              <Link href="/auth/signin" className="block text-sm text-[#2563eb] hover:text-[#1d4ed8]">
                Back to sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
