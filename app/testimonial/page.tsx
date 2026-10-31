// app/testimonial/page.tsx
import type { Metadata } from 'next';
import { Star } from 'lucide-react';
import { Testimonials } from '@/components/testimonial/Testimonials';
import { ChooseCta } from '@/components/choose/ChooseCta';
import { TESTIMONIALS } from '@/data/products';

export const metadata: Metadata = {
  title: 'Customer Reviews | LUMIÈRE',
  description: 'See what our customers say about LUMIÈRE skincare and cosmetics.',
};

export default function TestimonialPage() {
  const count = TESTIMONIALS.length;
  const average = count > 0 ? TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / count : 0;

  return (
    <>
      <section className="bg-linear-to-b from-rose-50 via-white to-white pb-6 pt-16 text-center sm:pt-24">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-600">Reviews</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-slate-900 sm:text-6xl">
            Loved by <span className="italic text-rose-600">our customers</span>
          </h1>

          {count > 0 && (
            <div className="mt-8 inline-flex flex-col items-center rounded-3xl border border-rose-100 bg-white px-10 py-6 shadow-sm">
              <p className="font-serif text-5xl font-bold text-slate-900">{average.toFixed(1)}</p>
              <div
                className="mt-2 flex gap-1"
                role="img"
                aria-label={`Average rating ${average.toFixed(1)} out of 5`}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={20}
                    aria-hidden="true"
                    className={
                      i < Math.round(average) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'
                    }
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Based on {count} customer {count === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          )}
        </div>
      </section>

      <Testimonials />
      <ChooseCta />
    </>
  );
}