'use client';

import React from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';

export const TestimonialHero: React.FC = () => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
        <MessageSquareQuote size={14} /> Customer Love
      </span>
      <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900">
        Loved by Skin Enthusiasts
      </h1>
      <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
        Read real experiences from clients who transformed their daily skincare rituals with our organic botanical formulas.
      </p>
    </div>
  );
};