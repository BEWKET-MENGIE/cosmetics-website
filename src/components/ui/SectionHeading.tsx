import React from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ eyebrow, title }) => (
  <div className="text-center max-w-2xl mx-auto mb-16">
    <p className="text-sm text-rose-500 font-bold uppercase tracking-widest">{eyebrow}</p>
    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-2 leading-snug">
      {title}
    </h2>
    <div className="w-16 h-1 bg-rose-500 mx-auto mt-4 rounded-full" aria-hidden="true" />
  </div>
);