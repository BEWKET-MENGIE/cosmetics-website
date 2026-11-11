// app/admin/testimonials/page.tsx
import { Star } from 'lucide-react';
import { AdminHeading, EmptyState, StatusBadge } from '@/components/admin/AdminUi';
import { TestimonialActions } from '@/components/admin/TestimonialActions';
import { TestimonialForm } from '@/components/admin/TestimonialForm';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/date';

export default async function AdminTestimonialsPage() {
  // Waiting for approval first, then newest
  const testimonials = await db.testimonial.findMany({
    orderBy: [{ isPublished: 'asc' }, { createdAt: 'desc' }],
  });
  const pending = testimonials.filter((t) => !t.isPublished).length;

  return (
    <div className="space-y-10">
      <div>
        <AdminHeading
          title="Testimonials"
          description={pending > 0 ? `${pending} waiting for your approval` : 'Everything is approved.'}
        />

        {testimonials.length === 0 ? (
          <EmptyState>No testimonials yet.</EmptyState>
        ) : (
          <ul className="space-y-3">
            {testimonials.map((t) => (
              <li
                key={t.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm ${t.isPublished ? 'border-slate-200' : 'border-amber-300'}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-semibold text-slate-900">{t.name}</p>
                      <span className="text-xs text-slate-500">
                        {t.role} · {formatDate(t.createdAt.toISOString())}
                      </span>
                      <StatusBadge status={t.isPublished ? 'published' : 'draft'} />
                    </div>
                    <div className="my-2 flex gap-0.5" role="img" aria-label={`${t.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={14}
                          aria-hidden="true"
                          className={i < t.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}
                        />
                      ))}
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{t.comment}</p>
                  </div>
                  <TestimonialActions id={t.id} name={t.name} isPublished={t.isPublished} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <section aria-labelledby="add-testimonial">
        <h2 id="add-testimonial" className="mb-4 font-serif text-2xl font-bold text-slate-900">
          Add a testimonial yourself
        </h2>
        <TestimonialForm />
      </section>
    </div>
  );
}