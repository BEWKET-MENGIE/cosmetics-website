// src/components/Hero/HeroFeaturedSlider.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { FEATURED_HERO_ITEMS } from '@/data/hero';
import { formatPrice } from '@/lib/format';

/**
 * Mobile: swipeable carousel (CSS scroll-snap, no library needed).
 * Desktop (≥ sm): 3-column grid.
 */
export const HeroFeaturedSlider: React.FC = () => {
  return (
    <section aria-labelledby="bestsellers-heading" className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
              Handpicked Essentials
            </span>
            <h2
              id="bestsellers-heading"
              className="mt-1 font-serif text-2xl font-bold text-slate-900 sm:text-3xl"
            >
              Bestsellers Spotlight
            </h2>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1 text-xs font-bold text-slate-800 transition-colors hover:text-rose-600"
          >
            View All <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <ul
          tabIndex={0}
          aria-label="Bestselling products"
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-rose-500 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {FEATURED_HERO_ITEMS.map((item) => (
            <li key={item.id} className="w-[85%] shrink-0 snap-start sm:w-auto">
              <article className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
                    {item.category}
                  </span>
                  <h3 className="truncate text-sm font-semibold text-slate-900">{item.name}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{formatPrice(item.price)}</span>
                    <span className="flex items-center gap-0.5 text-xs text-amber-500">
                      <Star size={12} fill="currentColor" aria-hidden="true" />
                      {/* toFixed keeps "5.0" instead of "5" */}
                      {item.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* TODO: link to the product page (/shop/${item.id}) when it exists */}
                <Link
                  href="/shop"
                  aria-label={`Shop ${item.name}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-rose-500 hover:text-white"
                >
                  <ShoppingBag size={16} aria-hidden="true" />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};