import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-black text-[#2563eb] mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page not found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-[#2563eb] text-white px-6 py-3 rounded-md font-medium hover:bg-[#1d4ed8]"
          >
            Go to Home
          </Link>
          <Link
            href="/help"
            className="border border-[#2563eb] text-[#2563eb] px-6 py-3 rounded-md font-medium hover:bg-blue-50"
          >
            Help Center
          </Link>
        </div>
      </div>
    </div>
  );
}
