// src/components/choose/ChooseCta.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const ChooseCta: React.FC = () => {
  return (
    <section aria-labelledby="choose-cta-title" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-rose-500 via-rose-500 to-pink-600 px-6 py-14 text-center text-white shadow-2xl shadow-rose-200 sm:px-12 sm:py-16">
          {/* Decorative circles */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-12 h-64 w-64 rounded-full bg-amber-300/20 blur-2xl"
          />

          <div className="relative">
            <h2 id="choose-cta-title" className="font-serif text-3xl font-bold leading-snug sm:text-4xl">
              Ready to Experience the Difference?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
              Discover skincare you can trust, made with care for your skin and the planet.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="/shop" variant="accent" className="w-full sm:w-auto">
                Shop the Collection
              </Button>
              <Link
                href="/news"
                className="inline-flex w-full items-center justify-center rounded-full border-2 border-white/70 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
              >
                Explore the Journal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};