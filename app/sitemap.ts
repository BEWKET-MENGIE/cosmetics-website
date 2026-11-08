// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/data/articles';
import { LEGAL_PAGES } from '@/data/legal';
import { SITE_URL } from '@/lib/site';
import { getAllProductSlugs } from '@/server/catalog';

const STATIC_ROUTES = [
  '',
  '/shop',
  '/category',
  '/features',
  '/choose',
  '/news',
  '/testimonial',
  '/contact',
  '/quiz',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productSlugs = await getAllProductSlugs();

  return [
    ...STATIC_ROUTES.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...productSlugs.map((slug) => ({ url: `${SITE_URL}/shop/${slug}` })),
    ...ARTICLES.map((article) => ({ url: `${SITE_URL}/news/${article.slug}` })),
    ...LEGAL_PAGES.map((page) => ({ url: `${SITE_URL}/legal/${page.slug}` })),
  ];
}