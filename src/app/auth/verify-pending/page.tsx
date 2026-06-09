'use client';

import Link from 'next/link';
import { Mail, Clock } from 'lucide-react';

export default function VerifyPendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-12 w-12 bg-[#2563eb] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Check your email
          </h2>
        </div>

        <div className="py-8 space-y-6">
          <Mail className="h-16 w-16 text-[#2563eb] mx-auto" />
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Verify your email address</h3>
            <p className="mt-4 text-gray-600">
              We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
            <p className="font-medium mb-2">📧 Didn't receive an email?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check your spam folder</li>
              <li>Make sure you entered the correct email</li>
              <li>Try again or use a different email address</li>
            </ul>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Verification link expires in 24 hours</span>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Link href="/auth/signin" className="block text-[#2563eb] hover:text-[#1d4ed8] text-sm font-medium">
              Back to sign in
            </Link>
            <Link href="/auth/signup" className="block text-[#2563eb] hover:text-[#1d4ed8] text-sm font-medium">
              Create different account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
