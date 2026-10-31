// src/components/Shop/ShopHero.tsx
import React from 'react';
import { Sparkles } from 'lucide-react';

export const ShopHero: React.FC = () => {
  return (
    <header className="mx-auto mb-12 max-w-2xl text-center">
      <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-700">
        <Sparkles size={14} aria-hidden="true" /> Full Collection
      </span>
      <h1 className="font-serif text-3xl font-bold text-slate-900 sm:text-5xl">
        Explore Luxury Cosmetics
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
        Discover our complete range of organic skincare, nourishing lip treatments, and radiant
        makeup essentials.
      </p>
    </header>
  );
};