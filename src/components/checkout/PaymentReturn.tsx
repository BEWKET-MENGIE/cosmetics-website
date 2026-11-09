// src/components/checkout/PaymentReturn.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle2, Clock3, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { postJson } from '@/lib/api';
import { loadLastOrder, saveLastOrder } from '@/lib/orders';

type View = 'checking' | 'paid' | 'pending' | 'failed' | 'error' | 'missing';

const MAX_CHECKS = 5;
const CHECK_DELAY_MS = 2500;

export const PaymentReturn: React.FC = () => {
  const router = useRouter();
  const ref = useSearchParams().get('ref');

  const [view, setView] = useState<View>('checking');
  const [round, setRound] = useState(0); // "Check again" starts a new round
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState('');

  useEffect(() => {
    if (!ref) {
      setView('missing');
      return;
    }

    let cancelled = false;
    let timer: number | undefined;
    let checks = 0;

    const check = async () => {
      setView('checking');
      const result = await postJson<{ state: string }>('/api/payments/verify', { number: ref });
      if (cancelled) return;

      if (!result.ok) {
        setView('error');
        return;
      }

      const state = result.data.state;

      if (state === 'paid') {
        // Update the copy kept in this browser, then show the confirmation page
        const saved = loadLastOrder();
        if (saved && saved.id === ref) {
          saveLastOrder({ ...saved, status: 'paid', paymentStatus: 'paid' });
          router.replace('/checkout/success');
          return;
        }
        setView('paid');
        return;
      }

      if (state === 'failed') {
        setView('failed');
        return;
      }

      // Pending: give the payment a few seconds to settle before giving up
      checks += 1;
      if (checks < MAX_CHECKS) timer = window.setTimeout(check, CHECK_DELAY_MS);
      else setView('pending');
    };

    void check();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [ref, round, router]);

  const tryAgain = async () => {
    if (!ref) return;
    setRetrying(true);
    setRetryError('');
    const result = await postJson<{ checkoutUrl: string }>('/api/payments/retry', { number: ref });
    if (!result.ok) {
      setRetryError(result.error);
      setRetrying(false);
      return;
    }
    window.location.assign(result.data.checkoutUrl);
  };

  const card = 'mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12';

  if (view === 'checking') {
    return (
      <div className={card} role="status" aria-live="polite">
        <Loader2 className="mx-auto animate-spin text-rose-500" size={40} aria-hidden="true" />
        <h1 className="mt-5 font-serif text-2xl font-bold text-slate-900">Confirming your payment...</h1>
        <p className="mt-2 text-sm text-slate-600">Please do not close this page.</p>
      </div>
    );
  }

  if (view === 'paid') {
    return (
      <div className={card}>
        <CheckCircle2 className="mx-auto text-emerald-500" size={48} aria-hidden="true" />
        <h1 className="mt-5 font-serif text-3xl font-bold text-slate-900">Payment received</h1>
        <p className="mt-2 text-slate-600">
          Thank you! Order <strong className="text-slate-900">{ref}</strong> is paid and we are preparing it.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/shop">Continue shopping</Button>
        </div>
      </div>
    );
  }

  if (view === 'missing') {
    return (
      <div className={card}>
        <AlertCircle className="mx-auto text-slate-400" size={44} aria-hidden="true" />
        <h1 className="mt-5 font-serif text-2xl font-bold text-slate-900">Nothing to confirm</h1>
        <p className="mt-2 text-slate-600">We could not find an order reference in this link.</p>
        <div className="mt-8 flex justify-center">
          <Button href="/account">Go to my account</Button>
        </div>
      </div>
    );
  }

  const copy =
    view === 'failed'
      ? {
          Icon: AlertCircle,
          color: 'text-rose-500',
          title: 'Payment was not completed',
          text: 'No money was taken. You can try again, and your order is still reserved for you.',
        }
      : view === 'pending'
        ? {
            Icon: Clock3,
            color: 'text-amber-500',
            title: 'Your payment is still processing',
            text: 'This can take a few minutes. We will mark the order as paid as soon as we are told.',
          }
        : {
            Icon: AlertCircle,
            color: 'text-rose-500',
            title: 'We could not check your payment',
            text: 'Something went wrong on our side. Your order is saved. Please check again in a moment.',
          };

  return (
    <div className={card} role="status">
      <copy.Icon className={`mx-auto ${copy.color}`} size={48} aria-hidden="true" />
      <h1 className="mt-5 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">{copy.title}</h1>
      <p className="mt-2 text-slate-600">{copy.text}</p>
      <p className="mt-3 text-sm text-slate-500">
        Order <strong className="text-slate-800">{ref}</strong>
      </p>

      {retryError && (
        <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {retryError}
        </p>
      )}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={tryAgain}
          disabled={retrying}
          className="w-full cursor-pointer rounded-full bg-rose-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {retrying ? 'Starting...' : 'Try payment again'}
        </button>
        {view !== 'failed' && (
          <button
            type="button"
            onClick={() => setRound((n) => n + 1)}
            className="w-full cursor-pointer rounded-full border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-rose-300 sm:w-auto"
          >
            Check again
          </button>
        )}
      </div>
    </div>
  );
};