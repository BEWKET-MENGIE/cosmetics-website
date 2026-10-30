// src/components/news/NewsHero.tsx
import React from 'react';
import { Sparkles } from 'lucide-react';

export const NewsHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-rose-50 via-white to-white pb-12 pt-16 sm:pb-16 sm:pt-24">
      {/* Decorative glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-rose-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-24 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-rose-700 shadow-sm backdrop-blur">
          <Sparkles size={14} aria-hidden="true" /> Lumière Journal
        </span>

        <h1 className="font-serif text-4xl font-bold leading-[1.1] text-slate-900 sm:text-6xl">
          Beauty Trends &amp;{' '}
          <span className="italic text-rose-600">Skincare Secrets</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Explore expert tips, organic ingredient breakdowns, and step-by-step beauty routines
          curated by our skincare specialists.
        </p>
      </div>
    </section>
  );
};