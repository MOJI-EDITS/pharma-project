import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Providers from '@/components/Providers';
import AIPharmacist from '@/components/ai/AIPharmacist';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "PharmaPlus - Your Trusted Pharmacy",
  description: "Premium pharmaceutical products and healthcare solutions delivered to your doorstep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <AIPharmacist />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
