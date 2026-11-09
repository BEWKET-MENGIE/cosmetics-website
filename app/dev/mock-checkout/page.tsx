// app/dev/mock-checkout/page.tsx
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { MockCheckout } from '@/components/checkout/MockCheckout';

export default function MockCheckoutPage() {
  if (process.env.NODE_ENV === 'production') notFound();

  return (
    <Suspense fallback={null}>
      <MockCheckout />
    </Suspense>
  );
}