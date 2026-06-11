import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For mobile app: remove static export to allow dynamic API routes
  // output: 'export',  // DISABLED for API routes support
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/pharma-plus-mall', destination: '/category/mall', permanent: true },
      { source: '/help-center', destination: '/help', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/terms-and-conditions', destination: '/terms', permanent: true },
    ];
  },
};

export default nextConfig;
