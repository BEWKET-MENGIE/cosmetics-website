// src/components/choose/ChooseProcess.tsx
import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PROCESS_STEPS } from '@/data/choose';

export const ChooseProcess: React.FC = () => {
  return (
    <section className="border-y border-rose-100/60 bg-rose-50/60 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="How It&apos;s Made" title="From Botanical to Bottle" />

        <div className="relative">
          {/* Connecting line between the circles (large screens only) */}
          <div
            aria-hidden="true"
            className="absolute inset-x-[12.5%] top-8 hidden h-px bg-rose-300/70 lg:block"
          />

          <ol className="relative grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {PROCESS_STEPS.map(({ Icon, title, description }, index) => (
              <li key={title} className="text-center">
                <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white text-rose-600 shadow-md ring-4 ring-rose-100">
                  <Icon size={26} aria-hidden="true" />
                  <span
                    aria-hidden="true"
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white"
                  >
                    {index + 1}
                  </span>
                </div>
                <h3 className="mb-2 font-serif text-lg font-bold text-slate-900">
                  <span className="sr-only">Step {index + 1}: </span>
                  {title}
                </h3>
                <p className="mx-auto max-w-xs text-sm leading-relaxed text-slate-600">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};