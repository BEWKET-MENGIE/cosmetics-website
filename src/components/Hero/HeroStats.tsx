// src/components/Hero/HeroStats.tsx
'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Award, Heart, Sparkles, Users } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';

interface Stat {
  Icon: LucideIcon;
  endValue: number;
  suffix?: string;
  decimals?: number;
  label: string;
}

// Make sure these numbers are real before publishing.
const STATS: Stat[] = [
  { Icon: Users, endValue: 50000, suffix: '+', label: 'Glowing Clients' },
  { Icon: Sparkles, endValue: 100, suffix: '%', label: 'Certified Organic' },
  { Icon: Award, endValue: 25, suffix: '+', label: 'Beauty Awards' },
  { Icon: Heart, endValue: 99.4, suffix: '%', decimals: 1, label: 'Satisfaction Rate' },
];

const formatNumber = (value: number, decimals: number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

interface StatCounterProps extends Stat {
  active: boolean;
}

const StatCounter: React.FC<StatCounterProps> = ({
  Icon,
  endValue,
  suffix = '',
  decimals = 0,
  label,
  active,
}) => {
  const value = useCountUp(endValue, { enabled: active });

  return (
    <div className="group space-y-2 rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4 transition-all hover:bg-slate-800">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white">
        <Icon size={22} aria-hidden="true" />
      </div>

      {/* Screen readers get the final value; the animated one is hidden from them */}
      <p className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
        <span className="sr-only">
          {formatNumber(endValue, decimals)}
          {suffix}
        </span>
        <span aria-hidden="true">
          {formatNumber(value, decimals)}
          <span className="text-rose-400">{suffix}</span>
        </span>
      </p>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
    </div>
  );
};

export const HeroStats: React.FC = () => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section aria-label="Brand statistics" className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-8 text-white shadow-2xl sm:p-12"
        >
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative z-10 grid grid-cols-2 gap-4 text-center sm:gap-6 md:grid-cols-4">
            {STATS.map((stat) => (
              <StatCounter key={stat.label} {...stat} active={inView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};