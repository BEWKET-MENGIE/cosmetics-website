// src/components/choose/ChooseCta.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const ChooseCta: React.FC = () => {
  return (
    <section
      aria-labelledby="choose-cta-title"
      className="mt-16 overflow-hidden rounded-3xl bg-linear-to-r from-rose-500 to-pink-600 px-6 py-12 text-center text-white sm:px-12 sm:py-14"
    >
      <h2 id="choose-cta-title" className="font-serif text-2xl font-bold sm:text-3xl">
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
          href="/testimonial"
          className="inline-flex w-full items-center justify-center rounded-full border-2 border-white/70 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10 sm:w-auto"
        >
          Read Customer Reviews
        </Link>
      </div>
    </section>
  );
};