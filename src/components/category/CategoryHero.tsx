'use client';

import React from 'react';
import { Layers } from 'lucide-react';

export const CategoryHero: React.FC = () => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
        <Layers size={14} /> Product Collections
      </span>
      <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900">
        Shop by Category
      </h1>
      <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
        Explore our curated skincare, makeup, and organic wellness lines tailored for your specific daily routine.
      </p>
    </div>
  );
};