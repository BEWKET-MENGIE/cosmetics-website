// src/components/testimonial/Testimonials.tsx
import { Quote, Star } from 'lucide-react';
import { AuthorAvatar } from '@/components/news/AuthorAvatar';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getTestimonials } from '@/server/content';

interface TestimonialsProps {
  /** Show only the newest N (e.g. 3 on the home page). */
  limit?: number;
}

export async function Testimonials({ limit }: TestimonialsProps) {
  const all = await getTestimonials();
  const testimonials = limit ? all.slice(0, limit) : all;

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Testimonials" title="What Our Customers Say" />

        <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.id} className="flex">
              <figure className="relative flex w-full flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50 p-8">
                <Quote size={40} className="absolute right-6 top-6 text-rose-200" aria-hidden="true" />
                <div>
                  <div className="mb-4 flex gap-1" role="img" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }, (_, i) => (
                      <Star key={i} size={16} className="fill-amber-400 text-amber-400" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="relative z-10 mb-6 text-sm italic leading-relaxed text-slate-600">
                    &ldquo;{t.comment}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="flex items-center gap-4 border-t border-slate-200/60 pt-4">
                  {t.avatar ? (
                    <img src={t.avatar} alt="" loading="lazy" className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <AuthorAvatar name={t.name} size="md" />
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <span className="text-xs font-medium text-rose-600">{t.role}</span>
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}