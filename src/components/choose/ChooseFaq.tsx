// src/components/choose/ChooseFaq.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FAQS } from '@/data/choose';

/**
 * Accordion built on the native <details> element: no JavaScript, works with the
 * keyboard, and the `name` attribute makes opening one question close the others.
 */
export const ChooseFaq: React.FC = () => {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="FAQ" title="Questions, Answered" />

        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              name="choose-faq"
              className="group rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left font-serif text-lg font-semibold text-slate-900 transition-colors hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition-transform duration-300 group-open:rotate-45"
                >
                  <Plus size={16} />
                </span>
              </summary>

              <div className="px-6 pb-6 leading-7 text-slate-600">
                <p>{faq.answer}</p>
                {faq.link && (
                  <Link
                    href={faq.link.href}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 transition-all hover:gap-2.5"
                  >
                    {faq.link.label} <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};