// app/category/page.tsx
import type { Metadata } from 'next';
import { CategoryHero } from '@/components/category/CategoryHero';
import { CategoryGrid } from '@/components/category/CategoryGrid';

export const metadata: Metadata = {
  title: 'Shop by Category | LUMIÈRE',
  description: 'Explore skincare, lip care, makeup and natural beauty oils.',
};

export default function CategoryPage() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategoryHero />
        <CategoryGrid />
      </div>
    </section>
  );
}