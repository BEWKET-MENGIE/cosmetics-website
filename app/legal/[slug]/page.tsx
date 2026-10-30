// app/legal/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { LEGAL_PAGES, getLegalPage } from '@/data/legal';
import { formatDate } from '@/lib/date';
import { SITE } from '@/lib/site';

interface LegalPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return LEGAL_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) return { title: 'Page not found | LUMIÈRE' };
  return { title: `${page.title} | LUMIÈRE`, description: page.intro };
}

function LegalSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-4 px-4 py-20" aria-busy="true">
      <div className="h-10 w-2/3 rounded bg-slate-200" />
      <div className="h-4 w-full rounded bg-slate-200" />
      <div className="h-4 w-5/6 rounded bg-slate-200" />
    </div>
  );
}

async function LegalContent({ params }: LegalPageProps) {
  const { slug } = await params;
  const page = getLegalPage(slug);

  if (!page) notFound();

  return (
    <article className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition-colors hover:text-rose-600"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to home
        </Link>

        <header className="border-b border-slate-200 pb-8">
          <h1 className="font-serif text-3xl font-bold text-slate-900 sm:text-5xl">{page.title}</h1>
          <p className="mt-3 text-lg text-slate-600">{page.intro}</p>
          <p className="mt-4 text-xs text-slate-500">
            Last updated: <time dateTime={page.updated}>{formatDate(page.updated)}</time>
          </p>
        </header>

        <div className="space-y-10 py-10">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-3 font-serif text-xl font-bold text-slate-900 sm:text-2xl">
                {section.heading}
              </h2>
              <div className="space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="leading-7 text-slate-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="rounded-2xl bg-rose-50 p-6 text-sm text-slate-700">
          Questions? Email us at{' '}
          <a
            href={`mailto:${SITE.contact.email}`}
            className="font-semibold text-rose-600 underline-offset-4 hover:underline"
          >
            {SITE.contact.email}
          </a>
          .
        </footer>
      </div>
    </article>
  );
}

export default function LegalPageRoute({ params }: LegalPageProps) {
  return (
    <Suspense fallback={<LegalSkeleton />}>
      <LegalContent params={params} />
    </Suspense>
  );
}