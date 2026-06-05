import Link from 'next/link';
import { ReactNode } from 'react';

interface InfoPageProps {
  title: string;
  children: ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl';
}

export default function InfoPage({ title, children, maxWidth = 'lg' }: InfoPageProps) {
  const widthClass =
    maxWidth === 'md' ? 'max-w-2xl' : maxWidth === 'xl' ? 'max-w-7xl' : 'max-w-4xl';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className={`${widthClass} mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
          {children}
          <div className="pt-8 mt-8 border-t border-gray-100">
            <Link
              href="/"
              className="inline-flex items-center text-[#2563eb] hover:underline font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
