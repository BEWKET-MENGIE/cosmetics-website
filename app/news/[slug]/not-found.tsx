// app/news/[slug]/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function ArticleNotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md">
        <p className="text-sm font-bold uppercase tracking-widest text-rose-600">404</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
          We couldn&apos;t find that article
        </h1>
        <p className="mt-3 text-slate-600">
          It may have been moved or removed. Browse the rest of the Journal instead.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/news">Back to Journal</Button>
          <Link href="/shop" className="text-sm font-semibold text-slate-700 hover:text-rose-600">
            Visit the shop
          </Link>
        </div>
      </div>
    </section>
  );
}