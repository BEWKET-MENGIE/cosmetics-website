// src/components/choose/WhyChooseUs.tsx
import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BENEFITS } from '@/data/benefits';

interface WhyChooseUsProps {
  /** How many benefits to show (default 4). */
  limit?: number;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ limit = 4 }) => {
  const items = BENEFITS.slice(0, limit);

  return (
    <section className="border-y border-rose-100/50 bg-rose-50/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="About Us" title="Why Choose LUMIÈRE?" />

        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {items.map(({ id, Icon, title, description }) => (
            <li
              key={id}
              className="rounded-2xl bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50">
                <Icon className="text-rose-500" size={32} aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};