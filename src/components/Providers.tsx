'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/lib/auth/context';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  );
}