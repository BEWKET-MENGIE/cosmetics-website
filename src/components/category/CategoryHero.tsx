// src/components/category/CategoryHero.tsx
import React from 'react';
import { Layers } from 'lucide-react';

export const CategoryHero: React.FC = () => {
  return (
    <header className="mx-auto mb-12 max-w-3xl text-center">
      <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-700">
        <Layers size={14} aria-hidden="true" /> Product Collections
      </span>
      <h1 className="font-serif text-3xl font-bold text-slate-900 sm:text-5xl">Shop by Category</h1>
      <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
        Explore our curated skincare, makeup, and organic wellness lines tailored for your specific
        daily routine.
      </p>
    </header>
  );
};