'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'skincare',
    name: 'Skincare Essentials',
    count: '24 Products',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
    description: 'Cleansers, botanical serums, and hydrators designed for daily glow.',
  },
  {
    id: 'lip-care',
    name: 'Lip Care & Balms',
    count: '12 Products',
    image: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&q=80&w=800',
    description: 'Nourishing oils, tinted butter balms, and exfoliating lip scrubs.',
  },
  {
    id: 'makeup',
    name: 'Eye & Face Makeup',
    count: '18 Products',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
    description: 'Lightweight concealers, glowing blushes, and organic mascaras.',
  },
  {
    id: 'oils',
    name: 'Natural Beauty Oils',
    count: '9 Products',
    image: 'https://images.unsplash.com/photo-1608248597263-000799965d83?auto=format&fit=crop&q=80&w=800',
    description: 'Cold-pressed jojoba, rosehip, and argan elixirs for hair and face.',
  },
];

export const CategoryGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.id}
          href={`/shop?category=${cat.id}`}
          className="group relative rounded-3xl overflow-hidden border border-slate-200/80 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-8 min-h-[260px]"
        >
          <div className="absolute inset-0 z-0">
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          </div>

          <div className="relative z-10 flex justify-between items-start">
            <span className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {cat.count}
            </span>
            <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-slate-900 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
              <ArrowUpRight size={18} />
            </div>
          </div>

          <div className="relative z-10 text-white mt-12">
            <h3 className="font-serif font-bold text-2xl mb-1 text-white group-hover:text-rose-200 transition-colors">
              {cat.name}
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed max-w-md">
              {cat.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};