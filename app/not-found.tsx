// app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md">
        <p className="font-serif text-8xl font-bold text-rose-200">404</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">
          The page you are looking for may have been moved or no longer exists.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/">Back to home</Button>
          <Link href="/shop" className="text-sm font-semibold text-slate-700 hover:text-rose-600">
            Browse the shop
          </Link>
        </div>
      </div>
    </section>
  );
}