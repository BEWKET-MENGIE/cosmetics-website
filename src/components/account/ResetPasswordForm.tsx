// src/components/account/ResetPasswordForm.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Field } from '@/components/ui/FormField';
import { authClient } from '@/lib/auth-client';

type Errors = { password?: string; confirm?: string };

export const ResetPasswordForm: React.FC = () => {
  const params = useSearchParams();
  const token = params.get('token');
  const linkProblem = params.get('error');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const card = 'mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8';

  if (!token || linkProblem) {
    return (
      <div className={`${card} text-center`}>
        <AlertCircle className="mx-auto text-rose-500" size={44} aria-hidden="true" />
        <h1 className="mt-5 font-serif text-2xl font-bold text-slate-900">This link is not valid</h1>
        <p className="mt-2 text-sm text-slate-600">It may have expired or already been used.</p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-block rounded-full bg-rose-500 px-6 py-3 text-sm font-bold text-white hover:bg-rose-600"
        >
          Get a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className={`${card} text-center`} role="status">
        <CheckCircle2 className="mx-auto text-emerald-500" size={48} aria-hidden="true" />
        <h1 className="mt-5 font-serif text-2xl font-bold text-slate-900">Password updated</h1>
        <p className="mt-2 text-sm text-slate-600">You can now sign in with your new password.</p>
        <Link
          href="/account"
          className="mt-6 inline-block rounded-full bg-rose-500 px-6 py-3 text-sm font-bold text-white hover:bg-rose-600"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    const found: Errors = {};
    if (password.length < 8) found.password = 'Use at least 8 characters.';
    if (confirm !== password) found.confirm = 'The passwords do not match.';
    setErrors(found);

    const first = (['password', 'confirm'] as const).find((key) => found[key]);
    if (first) {
      document.getElementById(`reset-${first}`)?.focus();
      return;
    }

    setBusy(true);
    const result = await authClient.resetPassword({ newPassword: password, token });
    setBusy(false);

    if (result.error) {
      setFormError(result.error.message ?? 'This link is no longer valid. Please request a new one.');
      return;
    }
    setDone(true);
  };

  return (
    <form onSubmit={onSubmit} noValidate className={`${card} space-y-5`}>
      <h1 className="font-serif text-2xl font-bold text-slate-900">Choose a new password</h1>

      <Field
        id="reset-password"
        label="New password"
        type="password"
        autoComplete="new-password"
        required
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setErrors((prev) => ({ ...prev, password: undefined }));
        }}
        error={errors.password}
        hint="At least 8 characters."
      />
      <Field
        id="reset-confirm"
        label="Repeat the password"
        type="password"
        autoComplete="new-password"
        required
        value={confirm}
        onChange={(e) => {
          setConfirm(e.target.value);
          setErrors((prev) => ({ ...prev, confirm: undefined }));
        }}
        error={errors.confirm}
      />

      {formError && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        aria-busy={busy}
        className="w-full cursor-pointer rounded-full bg-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-200 transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? 'Saving...' : 'Save new password'}
      </button>
    </form>
  );
};