// src/components/choose/ChooseBenefits.tsx
import React from 'react';
import { BENEFITS } from '@/data/benefits';

export const ChooseBenefits: React.FC = () => {
  return (
    <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {BENEFITS.map(({ id, Icon, title, description }) => (
        <li
          key={id}
          className="flex flex-col items-start rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <Icon size={24} aria-hidden="true" />
          </div>
          <h2 className="mb-2 font-serif text-xl font-bold text-slate-900">{title}</h2>
          <p className="text-sm leading-relaxed text-slate-500">{description}</p>
        </li>
      ))}
    </ul>
  );
};