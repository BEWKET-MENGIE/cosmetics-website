// src/components/checkout/MockCheckout.tsx
'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { postJson } from '@/lib/api';

type Outcome = 'success' | 'failed' | 'pending';

/** Development-only stand-in for Chapa's payment page. */
export const MockCheckout: React.FC = () => {
  const params = useSearchParams();
  const txRef = params.get('tx_ref');
  const returnUrl = params.get('return');
  const [busy, setBusy] = useState(false);

  const choose = async (outcome: Outcome) => {
    if (!txRef || !returnUrl) return;
    setBusy(true);
    if (outcome !== 'pending') {
      await postJson('/api/dev/mock-pay', { txRef, outcome });
    }
    // Only go back to this same site
    if (returnUrl.startsWith(window.location.origin)) window.location.assign(returnUrl);
    else setBusy(false);
  };

  if (!txRef || !returnUrl) {
    return <p className="p-10 text-center text-slate-600">This test page needs a payment reference.</p>;
  }

  const buttonClass =
    'w-full cursor-pointer rounded-full px-6 py-3 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm">
        <p className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
          Test mode: no real payment
        </p>
        <h1 className="mt-4 font-serif text-2xl font-bold text-slate-900">Mock payment page</h1>
        <p className="mt-2 text-sm text-slate-600">
          This stands in for Chapa while you build. Pick what should happen to payment{' '}
          <strong className="break-all text-slate-900">{txRef}</strong>.
        </p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => choose('success')}
            className={`${buttonClass} bg-emerald-500 text-white hover:bg-emerald-600`}
          >
            Pay successfully
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => choose('failed')}
            className={`${buttonClass} bg-rose-500 text-white hover:bg-rose-600`}
          >
            Make the payment fail
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => choose('pending')}
            className={`${buttonClass} border border-slate-200 bg-white text-slate-700 hover:border-rose-300`}
          >
            Leave it unpaid (close the page)
          </button>
        </div>
      </div>
    </section>
  );
};