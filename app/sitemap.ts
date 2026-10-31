// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/data/articles';
import { LEGAL_PAGES } from '@/data/legal';
import { ALL_PRODUCTS, productSlug } from '@/lib/products';
import { SITE_URL } from '@/lib/site';

const STATIC_ROUTES = ['', '/shop', '/category', '/features', '/choose', '/news', '/testimonial', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_ROUTES.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...ALL_PRODUCTS.map((product) => ({ url: `${SITE_URL}/shop/${productSlug(product)}` })),
    ...ARTICLES.map((article) => ({ url: `${SITE_URL}/news/${article.slug}` })),
    ...LEGAL_PAGES.map((page) => ({ url: `${SITE_URL}/legal/${page.slug}` })),
  ];
}