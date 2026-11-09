// app/checkout/return/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PaymentReturn } from '@/components/checkout/PaymentReturn';

export const metadata: Metadata = {
  title: 'Confirming Payment | LUMIÈRE',
  robots: { index: false, follow: false },
};

export default function CheckoutReturnPage() {
  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Required: PaymentReturn reads the URL (useSearchParams) */}
        <Suspense fallback={<div aria-busy="true" className="mx-auto h-64 max-w-lg animate-pulse rounded-3xl bg-slate-200/70" />}>
          <PaymentReturn />
        </Suspense>
      </div>
    </section>
  );
}