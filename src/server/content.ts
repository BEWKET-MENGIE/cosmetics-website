// src/server/content.ts
import { db } from '@/lib/db';

export async function getAllProductSlugs() {
  const products = await db.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return products.map((p) => p.slug);
}

export async function getAllArticleSlugs() {
  const articles = await db.article.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  return articles.map((a) => a.slug);
}

export async function getArticles() {
  const articles = await db.article.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  });
  return articles.map((art) => ({
    ...art,
    date: art.publishedAt.toISOString().split('T')[0],
    author: {
      name: art.authorName,
      role: art.authorRole,
    },
    body: parseArticleBody(art.body),
  }));
}

export async function getArticleBySlug(slug: string) {
  const article = await db.article.findUnique({
    where: { slug },
  });

  if (!article || !article.isPublished) return null;

  return {
    ...article,
    date: article.publishedAt.toISOString().split('T')[0],
    author: {
      name: article.authorName,
      role: article.authorRole,
    },
    body: parseArticleBody(article.body),
  };
}

export async function getTestimonials(limit?: number) {
  return await db.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    ...(limit ? { take: limit } : {}),
  });
}

export function parseArticleBody(bodyRaw: string) {
  try {
    return JSON.parse(bodyRaw);
  } catch {
    return [];
  }
}