
'use client';

import { Sparkles } from 'lucide-react';

interface HeroMarqueeProps {
  items: string[];
}

export function HeroMarquee({ items }: HeroMarqueeProps) {
  // Avoid rendering an empty animated marquee.
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Lumière skincare benefits"
      className="relative overflow-hidden border-y border-white/10 bg-[#10251D]"
    >
      {/* Accessible content: screen readers read the items once */}
      <ul className="sr-only">
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>

      {/* Animated visual content */}
      <div
        aria-hidden="true"
        className="hero-marquee-track flex w-max items-center py-4 sm:py-5"
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex shrink-0 items-center"
          >
            {items.map((item, index) => (
              <li
                key={`${copy}-${item}-${index}`}
                className="flex shrink-0 items-center gap-5 px-6 sm:gap-7 sm:px-10"
              >
                <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.16em] text-white/90 sm:text-sm sm:tracking-[0.2em]">
                  {item}
                </span>

                <Sparkles
                  size={16}
                  strokeWidth={1.5}
                  className="shrink-0 text-rose-300"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>

      {/* Soft edge gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#10251D] to-transparent sm:w-20"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#10251D] to-transparent sm:w-20"
      />
    </section>
  );
}
