// src/components/choose/ChooseIngredients.tsx
import React from 'react';
import { Check, X } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { INGREDIENTS_IN, INGREDIENTS_OUT } from '@/data/choose';

interface IngredientListProps {
  items: string[];
  variant: 'in' | 'out';
}

const IngredientList: React.FC<IngredientListProps> = ({ items, variant }) => {
  const Icon = variant === 'in' ? Check : X;
  const iconClass = variant === 'in' ? 'text-rose-500' : 'text-rose-300';

  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-base">
          <Icon size={18} className={`mt-1 shrink-0 ${iconClass}`} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

export const ChooseIngredients: React.FC = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Ingredients" title="What We Put In, What We Leave Out" />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Always inside */}
          <div className="rounded-3xl border border-rose-100 bg-linear-to-br from-rose-50 to-white p-8 text-slate-700 sm:p-10">
            <h3 className="flex items-center gap-3 font-serif text-2xl font-bold text-slate-900">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white">
                <Check size={20} aria-hidden="true" />
              </span>
              Always Inside
            </h3>
            <IngredientList items={INGREDIENTS_IN} variant="in" />
          </div>

          {/* Never inside */}
          <div className="rounded-3xl bg-slate-900 p-8 text-slate-200 sm:p-10">
            <h3 className="flex items-center gap-3 font-serif text-2xl font-bold text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                <X size={20} aria-hidden="true" />
              </span>
              Never Inside
            </h3>
            <IngredientList items={INGREDIENTS_OUT} variant="out" />
          </div>
        </div>
      </div>
    </section>
  );
};