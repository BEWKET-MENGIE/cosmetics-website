// src/components/choose/ChooseHero.tsx
import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HERO_PROOF } from '@/data/choose';

export const ChooseHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-rose-50 via-white to-white pb-16 pt-16 sm:pb-20 sm:pt-24">
      {/* Decorative glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-rose-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-40 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-rose-700 shadow-sm backdrop-blur">
          <ShieldCheck size={14} aria-hidden="true" /> The Lumière Promise
        </span>

        <h1 className="font-serif text-4xl font-bold leading-[1.1] text-slate-900 sm:text-6xl">
          Why Choose Our{' '}
          <span className="italic text-rose-600">Luxury Cosmetics</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          We combine rigorous skincare science with organic botanical ingredients to deliver
          uncompromising performance, without compromising on your values.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/shop" className="w-full sm:w-auto">
            Shop the Collection
          </Button>
          <Link
            href="/testimonial"
            className="inline-flex w-full items-center justify-center rounded-full border-2 border-slate-200 bg-white px-6 py-3 font-medium text-slate-800 transition-colors hover:border-rose-300 hover:text-rose-600 sm:w-auto"
          >
            Read Customer Reviews
          </Link>
        </div>

        <ul className="mt-14 grid gap-4 text-left sm:grid-cols-3">
          {HERO_PROOF.map(({ Icon, title, text }) => (
            <li
              key={title}
              className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Icon size={22} aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-slate-900">{title}</p>
                <p className="mt-0.5 text-sm text-slate-600">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};