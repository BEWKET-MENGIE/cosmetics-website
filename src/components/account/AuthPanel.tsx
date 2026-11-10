// src/components/account/AuthPanel.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import { Field } from '@/components/ui/FormField';
import { authClient } from '@/lib/auth-client';

type Mode = 'signin' | 'signup';
type Errors = { name?: string; email?: string; password?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AuthPanel: React.FC = () => {
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setErrors({});
    setFormError('');
    setNotice('');
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    setNotice('');

    const found: Errors = {};
    if (mode === 'signup' && name.trim().length < 2) found.name = 'Please enter your name.';
    if (!EMAIL_RE.test(email.trim())) found.email = 'Enter a valid email address.';
    if (password.length < 8) found.password = 'Use at least 8 characters.';
    setErrors(found);

    const first = (['name', 'email', 'password'] as const).find((key) => found[key]);
    if (first) {
      document.getElementById(`auth-${first}`)?.focus();
      return;
    }

    setBusy(true);
    const result =
      mode === 'signup'
        ? await authClient.signUp.email({
            name: name.trim(),
            email: email.trim(),
            password,
            callbackURL: '/account',
          })
        : await authClient.signIn.email({ email: email.trim(), password });
    setBusy(false);

    if (result.error) {
      setFormError(
        result.error.status === 403
          ? 'Please confirm your email first. We just sent you a new link.'
          : (result.error.message ?? 'Something went wrong. Please try again.'),
      );
      return;
    }

    // If verification is required there is no session yet, so tell the person what to do next.
    // Otherwise the session hook updates and this panel disappears by itself.
    if (mode === 'signup') {
      setNotice(`Account created. We sent a confirmation link to ${email.trim()}. Open it to finish.`);
      setPassword('');
    }
  };

  const tabClass = (active: boolean) =>
    `flex-1 cursor-pointer rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${
      active ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
    }`;

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex gap-1 rounded-full bg-slate-100 p-1">
        <button type="button" aria-pressed={mode === 'signin'} onClick={() => switchMode('signin')} className={tabClass(mode === 'signin')}>
          Sign in
        </button>
        <button type="button" aria-pressed={mode === 'signup'} onClick={() => switchMode('signup')} className={tabClass(mode === 'signup')}>
          Create account
        </button>
      </div>

      {notice ? (
        <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center text-sm leading-6 text-emerald-900">
          <MailCheck className="mx-auto mb-2 text-emerald-600" size={32} aria-hidden="true" />
          {notice}
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          {mode === 'signup' && (
            <Field
              id="auth-name"
              label="Full name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              error={errors.name}
            />
          )}
          <Field
            id="auth-email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
          />
          <Field
            id="auth-password"
            label="Password"
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
            hint={mode === 'signup' ? 'At least 8 characters.' : undefined}
          />

          {mode === 'signin' && (
            <p className="-mt-2 text-right text-sm">
              <Link href="/forgot-password" className="font-semibold text-rose-600 hover:underline">
                Forgot password?
              </Link>
            </p>
          )}

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
            {busy ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>
      )}
    </div>
  );
};