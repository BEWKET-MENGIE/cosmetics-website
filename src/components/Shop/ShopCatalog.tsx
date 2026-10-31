// src/components/Shop/ShopCatalog.tsx
'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FEATURED_PRODUCTS } from '@/data/products';
import { SHOP_CATEGORIES } from '@/data/categories';
import { filterAndSortProducts, isSortKey } from '@/lib/shop';
import type { SortKey } from '@/lib/shop';
import { ProductCard } from '@/components/ui/ProductCard';
import { ShopToolbar } from './ShopToolbar';

const SEARCH_DEBOUNCE_MS = 300;

export const ShopCatalog: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ---- Filters live in the URL: /shop?category=lip-care&sort=price-low&q=balm ----
  const urlQuery = searchParams.get('q') ?? '';
  const category = SHOP_CATEGORIES.find((c) => c.slug === searchParams.get('category'));
  const activeCategory = category?.slug ?? '';
  const sortParam = searchParams.get('sort');
  const sort: SortKey = isSortKey(sortParam) ? sortParam : 'featured';

  const updateParams = useCallback(
    (changes: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  // ---- Search: filters instantly, writes to the URL after a short pause ----
  const [searchText, setSearchText] = useState(urlQuery);
  const lastWrittenQuery = useRef(urlQuery);

  // The URL changed from outside (e.g. the navbar search): update the input
  useEffect(() => {
    if (urlQuery !== lastWrittenQuery.current) {
      lastWrittenQuery.current = urlQuery;
      setSearchText(urlQuery);
    }
  }, [urlQuery]);

  // The user typed: update the URL after they stop typing
  useEffect(() => {
    const term = searchText.trim();
    if (term === urlQuery) return;

    const timer = window.setTimeout(() => {
      lastWrittenQuery.current = term;
      updateParams({ q: term || null });
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchText, urlQuery, updateParams]);

  // ---- Results ----
  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const product of FEATURED_PRODUCTS) {
      result[product.category] = (result[product.category] ?? 0) + 1;
    }
    return result;
  }, []);

  const products = useMemo(
    () =>
      filterAndSortProducts(FEATURED_PRODUCTS, {
        query: searchText,
        category: category?.productCategory,
        sort,
      }),
    [searchText, category, sort],
  );

  const hasFilters = searchText.trim() !== '' || activeCategory !== '' || sort !== 'featured';

  const clearFilters = () => {
    lastWrittenQuery.current = '';
    setSearchText('');
    updateParams({ q: null, category: null, sort: null });
  };

  return (
    <div>
      <ShopToolbar
        query={searchText}
        onQueryChange={setSearchText}
        activeCategory={activeCategory}
        onCategoryChange={(slug) => updateParams({ category: slug || null })}
        sort={sort}
        onSortChange={(next) => updateParams({ sort: next === 'featured' ? null : next })}
        counts={counts}
        total={FEATURED_PRODUCTS.length}
      />

      <div className="mb-6 flex items-center justify-between px-1 text-sm text-slate-600">
        <p role="status" aria-live="polite">
          Showing <strong className="text-slate-900">{products.length}</strong>{' '}
          {products.length === 1 ? 'product' : 'products'}
          {category && (
            <>
              {' '}in <strong className="text-slate-900">{category.productCategory}</strong>
            </>
          )}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="cursor-pointer font-semibold text-rose-600 underline-offset-4 transition-colors hover:text-rose-700 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {products.length > 0 ? (
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <li key={product.id} className="flex">
              <div className="w-full">
                <ProductCard product={product} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-white py-20 text-center">
          <p className="font-serif text-lg font-bold text-slate-800">No products found</p>
          <p className="mt-1 text-sm text-slate-500">Try adjusting your search or category filters.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 cursor-pointer rounded-full bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-600"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};