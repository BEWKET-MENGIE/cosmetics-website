'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export const NewsHero: React.FC = () => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
        <Sparkles size={14} /> Lumière Journal
      </span>
      <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900">
        Beauty Trends & Skincare Secrets
      </h1>
      <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
        Explore expert tips, organic ingredient breakdowns, and step-by-step beauty routines curated by top aesthetic specialists.
      </p>
    </div>
  );
};