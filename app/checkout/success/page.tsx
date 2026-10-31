// app/checkout/success/page.tsx
import type { Metadata } from 'next';
import { OrderSuccess } from '@/components/checkout/OrderSuccess';

export const metadata: Metadata = {
  title: 'Order Confirmed | LUMIÈRE',
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <section className="bg-slate-50 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <OrderSuccess />
      </div>
    </section>
  );
}