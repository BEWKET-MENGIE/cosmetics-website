// src/components/news/ArticleGrid.tsx
import React from 'react';
import type { Article } from '@/data/articles';
import { ArticleCard } from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({ articles }) => {
  return (
    <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <li key={article.slug} className="flex">
          <ArticleCard article={article} />
        </li>
      ))}
    </ul>
  );
};