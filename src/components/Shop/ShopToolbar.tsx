// src/components/Shop/ShopToolbar.tsx
import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { SHOP_CATEGORIES } from '@/data/categories';
import { SORT_OPTIONS, isSortKey } from '@/lib/shop';
import type { SortKey } from '@/lib/shop';

interface ShopToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  /** Category slug. Empty string = all. */
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  /** Product count per category label, e.g. { Skincare: 5 } */
  counts: Record<string, number>;
  total: number;
}

const chipClass = (active: boolean) =>
  `flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${
    active
      ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
  }`;

const badgeClass = (active: boolean) =>
  `rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
    active ? 'bg-white/25 text-white' : 'bg-white text-slate-500'
  }`;

export const ShopToolbar: React.FC<ShopToolbarProps> = ({
  query,
  onQueryChange,
  activeCategory,
  onCategoryChange,
  sort,
  onSortChange,
  counts,
  total,
}) => {
  return (
    <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6 lg:flex-row">
      {/* Search */}
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="relative w-full lg:w-96"
      >
        <label htmlFor="shop-search" className="sr-only">
          Search products
        </label>
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          id="shop-search"
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-10 text-sm focus:outline-2 focus:outline-rose-500 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-slate-400 transition-colors hover:text-slate-700"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </form>

      {/* Category chips */}
      <div
        role="group"
        aria-label="Filter by category"
        className="flex w-full items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] lg:w-auto lg:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        <button
          type="button"
          onClick={() => onCategoryChange('')}
          aria-pressed={activeCategory === ''}
          className={chipClass(activeCategory === '')}
        >
          All <span className={badgeClass(activeCategory === '')}>{total}</span>
        </button>

        {SHOP_CATEGORIES.map((category) => {
          const active = activeCategory === category.slug;
          return (
            <button
              key={category.slug}
              type="button"
              onClick={() => onCategoryChange(category.slug)}
              aria-pressed={active}
              className={chipClass(active)}
            >
              {category.productCategory}
              <span className={badgeClass(active)}>{counts[category.productCategory] ?? 0}</span>
            </button>
          );
        })}
      </div>

      {/* Sort */}
      <div className="flex w-full items-center justify-end gap-2 lg:w-auto">
        <SlidersHorizontal size={16} className="shrink-0 text-slate-500" aria-hidden="true" />
        <label htmlFor="shop-sort" className="sr-only">
          Sort products
        </label>
        <select
          id="shop-sort"
          value={sort}
          onChange={(e) => {
            if (isSortKey(e.target.value)) onSortChange(e.target.value);
          }}
          className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-2 focus:outline-rose-500"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};