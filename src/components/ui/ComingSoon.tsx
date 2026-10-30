// src/components/ui/ComingSoon.tsx
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ComingSoonProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  Icon,
  title,
  description,
  ctaHref = '/shop',
  ctaLabel = 'Continue shopping',
}) => {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4 py-20 text-center">
      <div className="max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50">
          <Icon className="text-rose-500" size={32} aria-hidden="true" />
        </div>
        <h1 className="font-serif text-3xl font-bold leading-tight text-slate-900">{title}</h1>
        <p className="mt-3 text-slate-600">{description}</p>
        <div className="mt-8 flex justify-center">
          <Button href={ctaHref}>{ctaLabel}</Button>
        </div>
      </div>
    </section>
  );
};