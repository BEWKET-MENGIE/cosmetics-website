// app/reset-password/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/account/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password | LUMIÈRE',
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Required: ResetPasswordForm reads the URL (useSearchParams) */}
        <Suspense fallback={<div aria-busy="true" className="mx-auto h-80 max-w-md animate-pulse rounded-3xl bg-slate-200/70" />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </section>
  );
}