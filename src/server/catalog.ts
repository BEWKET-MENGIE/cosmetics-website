// src/server/catalog.ts
import { cacheLife, cacheTag } from 'next/cache';
import { db } from '@/lib/db';
import type { ShopCategory } from '@/data/categories';
import type { Product } from '@/types';

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  reviewsCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  category: { label: string };
}

const toProduct = (row: ProductRow): Product => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  category: row.category.label,
  description: row.description,
  image: row.image,
  price: row.price,
  rating: row.rating,
  reviewsCount: row.reviewsCount,
  isNew: row.isNew,
  isBestSeller: row.isBestSeller,
});

// Each function below is cached for an hour. Admin changes in Phase 6 will
// clear the cache with revalidateTag('products').

export async function getProducts(): Promise<Product[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('products');

  const rows = await db.product.findMany({
    where: { isActive: true },
    include: { category: { select: { label: true } } },
    orderBy: [{ featured: 'desc' }, { isBestSeller: 'desc' }, { name: 'asc' }],
  });
  return rows.map(toProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('products');

  const rows = await db.product.findMany({
    where: { isActive: true, featured: true },
    include: { category: { select: { label: true } } },
    orderBy: [{ isBestSeller: 'desc' }, { name: 'asc' }],
  });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('products');

  const row = await db.product.findFirst({
    where: { slug, isActive: true },
    include: { category: { select: { label: true } } },
  });
  return row ? toProduct(row) : null;
}

export async function getAllProductSlugs(): Promise<string[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('products');

  const rows = await db.product.findMany({ where: { isActive: true }, select: { slug: true } });
  return rows.map((row) => row.slug);
}

export async function getCategories(): Promise<ShopCategory[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('categories', 'products');

  const rows = await db.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    productCategory: row.label,
    description: row.description,
    image: row.image,
    productCount: row._count.products,
  }));
}