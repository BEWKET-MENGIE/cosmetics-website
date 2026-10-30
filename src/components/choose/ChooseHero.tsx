// src/components/choose/ChooseHero.tsx
import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const ChooseHero: React.FC = () => {
  return (
    <header className="mx-auto mb-12 max-w-3xl text-center">
      <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-700">
        <ShieldCheck size={14} aria-hidden="true" /> The Lumière Promise
      </span>
      <h1 className="font-serif text-3xl font-bold text-slate-900 sm:text-5xl">
        Why Choose Our Luxury Cosmetics
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
        We combine rigorous dermatological science with 100% organic botanical ingredients to
        deliver uncompromising skincare performance.
      </p>
    </header>
  );
};