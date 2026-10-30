// src/components/news/ArticleCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import type { Article } from '@/data/articles';
import { getReadingMinutes } from '@/data/articles';
import { formatDate } from '@/lib/date';
import { AuthorAvatar } from './AuthorAvatar';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-rose-500 hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {/* Decorative: the title next to it already describes the article */}
        <Image
          src={article.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-800 shadow-sm backdrop-blur-md">
          {article.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock size={12} aria-hidden="true" />
            {getReadingMinutes(article)} min read
          </span>
        </div>

        <h3 className="font-serif text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-rose-600">
          {/* The ::after layer makes the whole card clickable with a single link */}
          <Link
            href={`/news/${article.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {article.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{article.excerpt}</p>

        <div className="mt-auto flex items-center justify-between pt-6">
          <div className="flex items-center gap-2.5">
            <AuthorAvatar name={article.author.name} />
            <span className="text-xs font-semibold text-slate-700">{article.author.name}</span>
          </div>
          <span
            aria-hidden="true"
            className="flex items-center gap-1 text-xs font-bold text-rose-600 transition-all group-hover:gap-2"
          >
            Read <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </article>
  );
};