// src/components/news/JournalFeed.tsx
'use client';

import React, { useMemo, useState } from 'react';
import type { Article } from '@/data/articles';
import { articleCategories } from '@/lib/articles';
import { ArticleGrid } from './ArticleGrid';
import { FeaturedArticle } from './FeaturedArticle';

const ALL = 'All';

interface JournalFeedProps {
  articles: Article[];
}

export const JournalFeed: React.FC<JournalFeedProps> = ({ articles }) => {
  const [active, setActive] = useState(ALL);

  const filters = useMemo(() => [ALL, ...articleCategories(articles)], [articles]);
  const countFor = (filter: string) =>
    filter === ALL ? articles.length : articles.filter((a) => a.category === filter).length;

  const { featured, rest, total } = useMemo(() => {
    const visible = active === ALL ? articles : articles.filter((a) => a.category === active);
    // The featured card only appears in the "All" view
    const featuredArticle = active === ALL ? visible.find((a) => a.featured) : undefined;
    return {
      featured: featuredArticle,
      rest: featuredArticle ? visible.filter((a) => a !== featuredArticle) : visible,
      total: visible.length,
    };
  }, [active, articles]);

  return (
    <section aria-labelledby="latest-articles" className="bg-white pb-20 pt-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="latest-articles" className="sr-only">
          Latest articles
        </h2>

        {/* Category filter chips (scroll sideways on small screens) */}
        <div
          role="group"
          aria-label="Filter articles by category"
          className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {filters.map((filter) => {
            const selected = active === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActive(filter)}
                aria-pressed={selected}
                className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${
                  selected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:text-rose-600'
                }`}
              >
                {filter}
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    selected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {countFor(filter)}
                </span>
              </button>
            );
          })}
        </div>

        <p role="status" className="sr-only">
          Showing {total} {total === 1 ? 'article' : 'articles'}
        </p>

        {/* `key` replays the fade-in whenever the filter changes */}
        <div key={active} className="animate-fade-up space-y-10 motion-reduce:animate-none">
          {featured && <FeaturedArticle article={featured} />}
          <ArticleGrid articles={rest} />
        </div>
      </div>
    </section>
  );
};