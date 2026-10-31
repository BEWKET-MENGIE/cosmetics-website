// app/error.tsx
'use client';

import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md">
        <p className="text-sm font-bold uppercase tracking-widest text-rose-600">Something went wrong</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-slate-900">We hit a problem</h1>
        <p className="mt-3 text-slate-600">Please try again. If it keeps happening, contact us.</p>
        {error.digest && <p className="mt-2 text-xs text-slate-400">Reference: {error.digest}</p>}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer rounded-full bg-rose-500 px-6 py-3 font-medium text-white transition-colors hover:bg-rose-600"
          >
            Try again
          </button>
          <Link href="/" className="text-sm font-semibold text-slate-700 hover:text-rose-600">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}