// src/components/news/UnsubscribeForm.tsx
'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, MailX } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { postJson } from '@/lib/api';

export const UnsubscribeForm: React.FC = () => {
  const params = useSearchParams();
  const email = params.get('email');
  const token = params.get('token');

  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const card = 'mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12';

  if (!email || !token) {
    return (
      <div className={card}>
        <MailX className="mx-auto text-slate-400" size={44} aria-hidden="true" />
        <h1 className="mt-5 font-serif text-2xl font-bold text-slate-900">This link is not valid</h1>
        <p className="mt-2 text-slate-600">Please use the unsubscribe link from one of our emails.</p>
      </div>
    );
  }

  const unsubscribe = async () => {
    setStatus('sending');
    setError('');
    const result = await postJson('/api/newsletter/unsubscribe', { email, token });
    if (!result.ok) {
      setError(result.error);
      setStatus('error');
      return;
    }
    setStatus('done');
  };

  if (status === 'done') {
    return (
      <div className={card} role="status">
        <CheckCircle2 className="mx-auto text-emerald-500" size={48} aria-hidden="true" />
        <h1 className="mt-5 font-serif text-3xl font-bold text-slate-900">You are unsubscribed</h1>
        <p className="mt-2 text-slate-600">We will not send you any more newsletters.</p>
        <div className="mt-8 flex justify-center">
          <Button href="/">Back to the shop</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={card}>
      <MailX className="mx-auto text-rose-500" size={44} aria-hidden="true" />
      <h1 className="mt-5 font-serif text-2xl font-bold text-slate-900">Unsubscribe from our newsletter?</h1>
      <p className="mt-2 text-slate-600">
        <strong className="break-all text-slate-900">{email}</strong> will stop receiving our emails.
      </p>
      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {error}
        </p>
      )}
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={unsubscribe}
          disabled={status === 'sending'}
          className="cursor-pointer rounded-full bg-rose-500 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'sending' ? 'Unsubscribing...' : 'Yes, unsubscribe me'}
        </button>
      </div>
    </div>
  );
};