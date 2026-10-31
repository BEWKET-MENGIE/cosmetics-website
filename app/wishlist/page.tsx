// app/wishlist/page.tsx  (replace the whole file)
import type { Metadata } from 'next';
import { WishlistView } from '@/components/wishlist/WishlistView';

export const metadata: Metadata = {
  title: 'Wishlist | LUMIÈRE',
  robots: { index: false },
};

export default function WishlistPage() {
  return (
    <section className="min-h-[60vh] bg-slate-50 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">My Wishlist</h1>
        <WishlistView />
      </div>
    </section>
  );
}