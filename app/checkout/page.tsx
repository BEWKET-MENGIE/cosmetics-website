// app/checkout/page.tsx
import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';

export const metadata: Metadata = {
  title: 'Checkout | LUMIÈRE',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <section className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">Checkout</h1>
        <CheckoutForm />
      </div>
    </section>
  );
}