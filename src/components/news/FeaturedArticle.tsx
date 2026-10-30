// src/components/news/FeaturedArticle.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import type { Article } from '@/data/articles';
import { getReadingMinutes } from '@/data/articles';
import { formatDate } from '@/lib/date';
import { AuthorAvatar } from './AuthorAvatar';

interface FeaturedArticleProps {
  article: Article;
}

export const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ article }) => {
  return (
    <article className="group relative grid overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-shadow duration-300 focus-within:ring-2 focus-within:ring-rose-500 hover:shadow-xl lg:grid-cols-2">
      <div className="relative aspect-[16/11] overflow-hidden bg-slate-100 lg:aspect-auto lg:min-h-[420px]">
        <Image
          src={article.image}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-5 top-5 rounded-full bg-rose-500 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
          Featured
        </span>
      </div>

      <div className="flex flex-col justify-center p-8 sm:p-12">
        <p className="text-xs font-bold uppercase tracking-widest text-rose-600">{article.category}</p>

        <h3 className="mt-3 font-serif text-2xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-rose-600 sm:text-4xl">
          <Link
            href={`/news/${article.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {article.title}
          </Link>
        </h3>

        <p className="mt-4 text-base leading-relaxed text-slate-600">{article.excerpt}</p>

        <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock size={12} aria-hidden="true" />
            {getReadingMinutes(article)} min read
          </span>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AuthorAvatar name={article.author.name} size="md" />
            <div>
              <p className="text-sm font-semibold text-slate-900">{article.author.name}</p>
              <p className="text-xs text-slate-500">{article.author.role}</p>
            </div>
          </div>
          <span
            aria-hidden="true"
            className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition-colors group-hover:bg-rose-600"
          >
            Read article <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </article>
  );
};