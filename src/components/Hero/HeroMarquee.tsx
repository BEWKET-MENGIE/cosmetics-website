// src/components/Hero/HeroMarquee.tsx
import React from 'react';
import { Sparkles } from 'lucide-react';

interface HeroMarqueeProps {
  items: string[];
}

/**
 * Endless scrolling text strip. The list is rendered twice and the track moves
 * left by exactly half its width, so the loop has no visible jump.
 * The animation itself lives in app/globals.css (.hero-marquee-track).
 */
export const HeroMarquee: React.FC<HeroMarqueeProps> = ({ items }) => {
  return (
    <div className="hero-marquee relative overflow-hidden border-t border-white/15 bg-slate-950/50 backdrop-blur-sm">
      {/* Screen readers get the list once, without the animation */}
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div aria-hidden="true" className="hero-marquee-track flex w-max py-3">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex min-w-[100vw] shrink-0 items-center justify-around">
            {items.map((item) => (
              <li key={`${copy}-${item}`} className="flex items-center whitespace-nowrap">
                <span className="px-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 sm:text-sm">
                  {item}
                </span>
                <Sparkles size={14} className="text-rose-300" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};