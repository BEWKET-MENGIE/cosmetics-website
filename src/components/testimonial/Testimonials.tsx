import React from 'react';
import { TESTIMONIALS } from '@/data/products';
import { Star, Quote } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="scroll-mt-20 py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Testimonials" title="What Our Customers Say" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.id}
              className="bg-slate-50 p-8 rounded-2xl relative flex flex-col justify-between border border-slate-100"
            >
              <Quote size={40} className="text-rose-200 absolute top-6 right-6" aria-hidden="true" />
              <div>
                <div className="flex gap-1 mb-4" role="img" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }, (_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="text-slate-600 text-sm leading-relaxed mb-6 relative z-10">
                  “{t.comment}”
                </blockquote>
              </div>
              <figcaption className="flex items-center gap-4 pt-4 border-t border-slate-200/60">
                <img src={t.avatar} alt={t.name} loading="lazy" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  <span className="text-xs text-rose-600 font-medium">{t.role}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};