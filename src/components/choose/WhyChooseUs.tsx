// src/components/choose/WhyChooseUs.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BENEFITS } from '@/data/benefits';

interface WhyChooseUsProps {
  /** How many benefits to show (default 4). */
  limit?: number;
  /** Show a "Learn more" link to the full /choose page. */
  showLink?: boolean;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ limit = 4, showLink = false }) => {
  const items = BENEFITS.slice(0, limit);

  return (
    <section className="border-y border-rose-100/50 bg-rose-50/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="About Us" title="Why Choose LUMIÈRE?" />

        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {items.map(({ id, Icon, title, description }) => (
            <li
              key={id}
              className="group rounded-2xl bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 transition-colors duration-300 group-hover:bg-rose-500">
                <Icon
                  className="text-rose-500 transition-colors duration-300 group-hover:text-white"
                  size={32}
                  aria-hidden="true"
                />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{description}</p>
            </li>
          ))}
        </ul>

        {showLink && (
          <div className="mt-12 text-center">
            <Link
              href="/choose"
              className="inline-flex items-center gap-2 text-sm font-bold text-rose-600 transition-all hover:gap-3"
            >
              Learn more about us <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};