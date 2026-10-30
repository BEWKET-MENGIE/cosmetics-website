// app/news/[slug]/page.tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { ARTICLES, getArticleBySlug, getReadingMinutes, getRelatedArticles } from '@/data/articles';
import { formatDate } from '@/lib/date';
import { ArticleBody } from '@/components/news/ArticleBody';
import { ArticleGrid } from '@/components/news/ArticleGrid';
import { AuthorAvatar } from '@/components/news/AuthorAvatar';
import { CopyLinkButton } from '@/components/news/CopyLinkButton';
import { Newsletter } from '@/components/news/Newsletter';
import { ReadingProgress } from '@/components/news/ReadingProgress';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// Builds every article page ahead of time
export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) return { title: 'Article not found | LUMIÈRE' };

  return {
    title: `${article.title} | LUMIÈRE Journal`,
    description: article.excerpt,
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
      images: [{ url: article.image }],
    },
  };
}

function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-4 px-4 py-20" aria-busy="true">
      <div className="h-4 w-32 rounded bg-slate-200" />
      <div className="h-12 w-full rounded bg-slate-200" />
      <div className="h-12 w-2/3 rounded bg-slate-200" />
      <div className="h-64 rounded-3xl bg-slate-200" />
    </div>
  );
}

async function ArticleContent({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const related = getRelatedArticles(article);

  return (
    <>
      <ReadingProgress />

      <article>
        <header className="bg-linear-to-b from-rose-50 via-white to-white pb-10 pt-10 sm:pt-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Link
              href="/news"
              className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition-colors hover:text-rose-600"
            >
              <ArrowLeft size={16} aria-hidden="true" /> Back to Journal
            </Link>

            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-rose-600">
              {article.category}
            </p>
            <h1 className="font-serif text-3xl font-bold leading-tight text-slate-900 sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">{article.excerpt}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-slate-200 pt-6">
              <div className="flex items-center gap-3">
                <AuthorAvatar name={article.author.name} size="md" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{article.author.name}</p>
                  <p className="text-xs text-slate-500">{article.author.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <time dateTime={article.date}>{formatDate(article.date)}</time>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} aria-hidden="true" />
                  {getReadingMinutes(article)} min read
                </span>
              </div>

              <div className="sm:ml-auto">
                <CopyLinkButton />
              </div>
            </div>
          </div>
        </header>

        {/* Cover image */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-slate-100 shadow-xl">
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Body */}
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
          <ArticleBody blocks={article.body} />
        </div>
      </article>

      {/* Related articles */}
      <section aria-labelledby="related-title" className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2
            id="related-title"
            className="mb-8 font-serif text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Keep reading
          </h2>
          <ArticleGrid articles={related} />
        </div>
      </section>

      <Newsletter />
    </>
  );
}

export default function ArticlePage({ params }: ArticlePageProps) {
  // Suspense is required because `params` is awaited (Cache Components is enabled)
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <ArticleContent params={params} />
    </Suspense>
  );
}