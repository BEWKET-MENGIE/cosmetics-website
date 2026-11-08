
'use client';

import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';

import {
  Award,
  Heart,
  Sparkles,
  Users,
  ArrowUpRight,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

// ==========================================
// TYPES
// ==========================================

interface Stat {
  Icon: LucideIcon;
  endValue: number;
  suffix?: string;
  decimals?: number;
  label: string;
  description: string;
}

interface StatCounterProps extends Stat {
  active: boolean;
}

// ==========================================
// STATISTICS DATA
// Verify all figures before publishing.
// ==========================================

const STATS: Stat[] = [
  {
    Icon: Users,
    endValue: 50000,
    suffix: '+',
    label: 'Happy Customers',
    description: 'Beauty lovers trust our products',
  },
  {
    Icon: Sparkles,
    endValue: 100,
    suffix: '%',
    label: 'Organic Ingredients',
    description: 'Naturally inspired skincare',
  },
  {
    Icon: Award,
    endValue: 25,
    suffix: '+',
    label: 'Beauty Awards',
    description: 'Recognized for quality',
  },
  {
    Icon: Heart,
    endValue: 99.4,
    suffix: '%',
    decimals: 1,
    label: 'Customer Satisfaction',
    description: 'Loved by our community',
  },
];

// ==========================================
// NUMBER FORMATTER
// ==========================================

const formatNumber = (value: number, decimals = 0) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

// ==========================================
// INDIVIDUAL STATISTIC
// ==========================================

function StatCounter({
  Icon,
  endValue,
  suffix = '',
  decimals = 0,
  label,
  description,
  active,
}: StatCounterProps) {
  const value = useCountUp(endValue, {
    enabled: active,
  });

  return (
    <article className="group relative flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-7 text-center transition-all duration-500 hover:-translate-y-1 hover:border-rose-300/40 hover:bg-white/[0.08] sm:px-5 sm:py-9">

      {/* Icon */}
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-400/10 text-rose-300 transition-all duration-500 group-hover:scale-110 group-hover:border-rose-300 group-hover:bg-rose-500 group-hover:text-white">
        <Icon
          size={25}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </div>

      {/* Animated Number */}
      <p className="font-serif text-3xl font-bold tracking-tight text-[#FFFDF8] sm:text-4xl lg:text-5xl">
        {/* Accessible final value */}
        <span className="sr-only">
          {formatNumber(endValue, decimals)}
          {suffix}
        </span>

        {/* Visual animated value */}
        <span aria-hidden="true">
          {formatNumber(value, decimals)}
          <span className="text-[#F48CA9]">{suffix}</span>
        </span>
      </p>

      {/* Label */}
      <h3 className="mt-3 text-xs font-bold uppercase tracking-[0.13em] text-white sm:text-sm">
        {label}
      </h3>

      {/* Description */}
      <p className="mt-2 max-w-[190px] text-xs leading-6 text-white/50">
        {description}
      </p>

      {/* Decorative accent */}
      <div className="mt-5 h-0.5 w-8 rounded-full bg-rose-400/60 transition-all duration-500 group-hover:w-16 group-hover:bg-rose-300" />

    </article>
  );
}

// ==========================================
// MAIN HERO STATISTICS SECTION
// ==========================================

export function HeroStats() {
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0.3,
  });

  return (
    <section
      aria-labelledby="hero-stats-heading"
      className="relative overflow-hidden bg-[#F8F2E9] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >

      <div className="mx-auto max-w-7xl">

        {/* ==================================
            SECTION INTRODUCTION
        ================================== */}

        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">

          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-rose-600">
            <Sparkles size={15} aria-hidden="true" />
            Our Growing Community
          </span>

          <h2
            id="hero-stats-heading"
            className="mt-4 font-serif text-3xl font-bold leading-tight text-[#18352B] sm:text-4xl lg:text-5xl"
          >
            Beauty That Speaks
            <span className="block italic text-rose-500">
              For Itself
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#647067] sm:text-base">
            Every number tells a story of trust, natural beauty,
            and our commitment to helping you feel confident
            in your own skin.
          </p>

        </div>

        {/* ==================================
            STATISTICS CONTAINER
        ================================== */}

        <div
          ref={ref}
          className="relative isolate overflow-hidden rounded-[2rem] border border-[#294538] bg-[#10251D] p-5 shadow-2xl shadow-[#10251D]/15 sm:p-8 lg:p-12"
        >

          {/* Background Decorative Effects */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-rose-400/10 blur-[100px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -left-32 -z-10 h-96 w-96 rounded-full bg-emerald-400/10 blur-[110px]"
          />

          {/* Top Heading */}
          <div className="relative mb-8 flex flex-col items-center justify-between gap-4 border-b border-white/10 pb-7 sm:flex-row sm:pb-8">

            <div className="text-center sm:text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-300 sm:text-xs">
                The Lumière Experience
              </p>

              <h3 className="mt-2 font-serif text-xl font-semibold text-white sm:text-2xl">
                Our Journey in Numbers
              </h3>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70 sm:text-xs">
                Growing Naturally
              </span>
            </div>

          </div>

          {/* Statistics Grid */}
          <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">

            {STATS.map((stat) => (
              <StatCounter
                key={stat.label}
                {...stat}
                active={inView}
              />
            ))}

          </div>

          {/* Bottom Brand Message */}
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-7 text-center sm:flex-row sm:gap-4">

            <div className="flex items-center gap-2 text-rose-300">
              <Heart
                size={16}
                fill="currentColor"
                aria-hidden="true"
              />

              <span className="text-xs font-semibold uppercase tracking-wider">
                Made with care
              </span>
            </div>

            <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />

            <p className="text-xs text-white/60">
              Pure botanicals. Timeless beauty. Natural radiance.
            </p>

            <ArrowUpRight
              size={16}
              className="hidden text-rose-300 sm:block"
              aria-hidden="true"
            />

          </div>

        </div>
      </div>
    </section>
  );
}
