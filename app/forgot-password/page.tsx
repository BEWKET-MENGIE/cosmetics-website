// app/forgot-password/page.tsx
import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/account/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password | LUMIÈRE',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ForgotPasswordForm />
      </div>
    </section>
  );
}