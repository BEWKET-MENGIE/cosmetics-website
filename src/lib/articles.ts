// src/lib/articles.ts
import type { Article } from '@/data/articles';

export const articleCategories = (articles: Article[]): string[] =>
  Array.from(new Set(articles.map((article) => article.category)));

/** Same-category articles first, then the rest. Never includes the current one. */
export function getRelatedArticles(all: Article[], current: Article, limit = 3): Article[] {
  const others = all.filter((article) => article.slug !== current.slug);
  const sameCategory = others.filter((article) => article.category === current.category);
  const rest = others.filter((article) => article.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}