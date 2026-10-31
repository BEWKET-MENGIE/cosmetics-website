// src/lib/products.ts
import { FEATURED_PRODUCTS } from '@/data/products';
import type { Product } from '@/types';

/** The full product list. If you later add a bigger list, change it here only. */
export const ALL_PRODUCTS: Product[] = FEATURED_PRODUCTS;

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const productSlug = (product: Product): string => slugify(product.name);
export const productHref = (product: Product): string => `/shop/${productSlug(product)}`;

export const getProductBySlug = (slug: string): Product | undefined =>
  ALL_PRODUCTS.find((product) => productSlug(product) === slug);

/** Same-category products first, then the rest. Never includes the current one. */
export function getRelatedProducts(current: Product, limit = 4): Product[] {
  const others = ALL_PRODUCTS.filter((p) => p.id !== current.id);
  const same = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);
  return [...same, ...rest].slice(0, limit);
}