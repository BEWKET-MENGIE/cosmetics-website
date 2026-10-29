import React from 'react';
import { NewsHero, ArticleGrid, Newsletter } from '@/components/news';

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsHero />
        <ArticleGrid />
        <Newsletter />
      </div>
    </main>
  );
}