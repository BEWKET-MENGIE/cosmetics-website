// app/admin/layout.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AdminGate } from '@/components/admin/AdminGate';

export const metadata: Metadata = {
  title: 'Admin | LUMIÈRE',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Everything under /admin is dynamic (it reads who you are), so it lives inside this Suspense
  return (
    <Suspense
      fallback={
        <div aria-busy="true" className="mx-auto max-w-7xl px-4 py-10">
          <div className="h-96 animate-pulse rounded-2xl bg-slate-200/70" />
        </div>
      }
    >
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}