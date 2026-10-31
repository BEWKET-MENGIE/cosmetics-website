// src/lib/shop.ts
import type { Product } from '@/types';

export type SortKey = 'featured' | 'price-low' | 'price-high' | 'rating';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Sort by: Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export const isSortKey = (value: string | null): value is SortKey =>
  SORT_OPTIONS.some((option) => option.value === value);

interface ShopFilters {
  query: string;
  /** Product category label, e.g. "Skincare". Undefined = all categories. */
  category: string | undefined;
  sort: SortKey;
}

export function filterAndSortProducts(
  products: Product[],
  { query, category, sort }: ShopFilters,
): Product[] {
  const term = query.trim().toLowerCase();

  const result = products.filter((product) => {
    const matchesCategory = !category || product.category === category;
    const matchesSearch =
      !term ||
      [product.name, product.description, product.category].some((text) =>
        text.toLowerCase().includes(term),
      );
    return matchesCategory && matchesSearch;
  });

  switch (sort) {
    case 'price-low':
      return result.sort((a, b) => a.price - b.price);
    case 'price-high':
      return result.sort((a, b) => b.price - a.price);
    case 'rating':
      return result.sort((a, b) => b.rating - a.rating);
    default:
      return result; // "featured" keeps the original order
  }
}