// src/lib/products.ts
import type { Product } from '@/types';

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const productSlug = (product: Product): string => product.slug ?? slugify(product.name);
export const productHref = (product: Product): string => `/shop/${productSlug(product)}`;

/** Same-category products first, then the rest. Never includes the current one. */
export function getRelatedProducts(all: Product[], current: Product, limit = 4): Product[] {
  const others = all.filter((p) => p.id !== current.id);
  const same = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);
  return [...same, ...rest].slice(0, limit);
}