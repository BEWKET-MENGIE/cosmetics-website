// src/components/category/CategoryGrid.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SHOP_CATEGORIES, categoryHref, formatProductCount } from '@/data/categories';

export const CategoryGrid: React.FC = () => {
  return (
    <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      {SHOP_CATEGORIES.map((cat, index) => (
        <li key={cat.slug} className="flex">
          <Link
            href={categoryHref(cat.slug)}
            className="group relative flex min-h-[260px] flex-1 flex-col justify-between overflow-hidden rounded-3xl bg-slate-900 p-8 shadow-sm transition-all duration-300 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
          >
            {/* Background image + dark overlay (keeps the white text readable) */}
            <Image
              src={cat.image}
              alt=""
              fill
              priority={index < 2}
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/40 to-slate-950/10" />

            <div className="relative z-10 flex items-start justify-between">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-md">
                {formatProductCount(cat.productCount)}
              </span>
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 backdrop-blur-md transition-colors group-hover:bg-rose-500 group-hover:text-white"
              >
                <ArrowUpRight size={18} />
              </span>
            </div>

            <div className="relative z-10 mt-12 text-white">
              <h2 className="mb-1 font-serif text-2xl font-bold transition-colors group-hover:text-rose-200">
                {cat.name}
              </h2>
              <p className="max-w-md text-xs leading-relaxed text-slate-200">{cat.description}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};