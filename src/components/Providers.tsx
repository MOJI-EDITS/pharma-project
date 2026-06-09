'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/lib/auth/context';
import Toast from '@/components/Toast';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <Toast />
        {children}
      </AuthProvider>
    </SessionProvider>
  );
}