// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { getAllProductSlugs, getAllArticleSlugs } from '@/server/content';

const STATIC_ROUTES = ['', '/shop', '/news', '/testimonial', '/contact', '/about', '/quiz'];
const LEGAL_PAGES = [{ slug: 'privacy' }, { slug: 'terms' }, { slug: 'shipping' }, { slug: 'returns' }];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, articleSlugs] = await Promise.all([
    getAllProductSlugs(),
    getAllArticleSlugs(),
  ]);

  return [
    ...STATIC_ROUTES.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...productSlugs.map((slug) => ({ url: `${SITE_URL}/shop/${slug}` })),
    ...articleSlugs.map((slug) => ({ url: `${SITE_URL}/news/${slug}` })),
    ...LEGAL_PAGES.map((page) => ({ url: `${SITE_URL}/legal/${page.slug}` })),
  ];
}