// app/shop/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ShopHero } from '@/components/Shop/ShopHero';
import { ShopCatalog } from '@/components/Shop/ShopCatalog';
import { ShopSkeleton } from '@/components/Shop/ShopSkeleton';

export const metadata: Metadata = {
  title: 'Shop | LUMIÈRE',
  description: 'Browse organic skincare, lip care, makeup and natural beauty oils.',
};

export default function ShopPage() {
  return (
    <section className="min-h-[60vh] bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ShopHero />
        {/* Required: ShopCatalog reads the URL (useSearchParams) */}
        <Suspense fallback={<ShopSkeleton />}>
          <ShopCatalog />
        </Suspense>
      </div>
    </section>
  );
}