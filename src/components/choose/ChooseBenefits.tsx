// src/components/choose/ChooseBenefits.tsx
import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BENEFITS } from '@/data/benefits';

export const ChooseBenefits: React.FC = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="What You Get" title="Six Reasons to Choose Lumière" />

        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map(({ id, Icon, title, description }) => (
            <li
              key={id}
              className="group flex flex-col items-start rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-xl motion-reduce:transform-none"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 transition-colors duration-300 group-hover:bg-rose-500 group-hover:text-white">
                <Icon size={24} aria-hidden="true" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-bold text-slate-900">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};