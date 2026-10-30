// src/components/category/CategorySection.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SHOP_CATEGORIES, categoryHref, formatProductCount } from '@/data/categories';

interface CategorySectionProps {
  /** Show only the first N categories (e.g. 4 on the home page). */
  limit?: number;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ limit }) => {
  const categories = limit ? SHOP_CATEGORIES.slice(0, limit) : SHOP_CATEGORIES;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Categories" title="Shop by Category" />

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={categoryHref(category.slug)}
                className="group relative block h-80 overflow-hidden rounded-2xl bg-slate-900 shadow-sm transition-all duration-500 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
              >
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs font-medium text-rose-200">
                    {formatProductCount(category.productCount)}
                  </span>
                  <h3 className="mt-1 text-xl font-bold transition-colors group-hover:text-rose-200">
                    {category.name}
                  </h3>
                  {/* Always visible on touch screens; revealed on hover/focus from lg up */}
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-rose-300 transition-all duration-300 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100">
                    <span>View More</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};