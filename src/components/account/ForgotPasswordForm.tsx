// src/components/account/ForgotPasswordForm.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import { Field } from '@/components/ui/FormField';
import { authClient } from '@/lib/auth-client';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!EMAIL_RE.test(email.trim())) {
      setError('Enter a valid email address.');
      document.getElementById('forgot-email')?.focus();
      return;
    }

    setBusy(true);
    const { error: requestError } = await authClient.requestPasswordReset({
      email: email.trim(),
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);

    if (requestError?.status === 429) {
      setError('Too many attempts. Please wait a few minutes and try again.');
      return;
    }

    // Same message whether or not the email has an account, so nobody can probe for accounts
    setSent(true);
  };

  const card = 'mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8';

  if (sent) {
    return (
      <div className={`${card} text-center`} role="status">
        <MailCheck className="mx-auto text-emerald-500" size={44} aria-hidden="true" />
        <h1 className="mt-5 font-serif text-2xl font-bold text-slate-900">Check your email</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          If an account exists for <strong className="text-slate-900">{email.trim()}</strong>, we sent a link to
          reset the password. It can take a minute to arrive.
        </p>
        <Link href="/account" className="mt-6 inline-block text-sm font-semibold text-rose-600 hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={`${card} space-y-5`}>
      <div>
        <h1 className="font-serif text-2xl font-bold text-slate-900">Forgot your password?</h1>
        <p className="mt-2 text-sm text-slate-600">Enter your email and we will send you a reset link.</p>
      </div>

      <Field
        id="forgot-email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError('');
        }}
        error={error}
      />

      <button
        type="submit"
        disabled={busy}
        aria-busy={busy}
        className="w-full cursor-pointer rounded-full bg-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-200 transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? 'Sending...' : 'Send reset link'}
      </button>

      <p className="text-center text-sm">
        <Link href="/account" className="font-semibold text-slate-600 hover:text-rose-600">
          Back to sign in
        </Link>
      </p>
    </form>
  );
};