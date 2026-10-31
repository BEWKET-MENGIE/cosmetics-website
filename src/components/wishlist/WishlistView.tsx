// src/components/wishlist/WishlistView.tsx
'use client';

import React from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ALL_PRODUCTS } from '@/lib/products';

export const WishlistView: React.FC = () => {
  const { ids, isHydrated, clear } = useWishlist();
  const { addToCart } = useCart();

  // Wait for the saved list to load, otherwise "empty" flashes for a moment
  if (!isHydrated) {
    return (
      <div aria-busy="true" className="grid animate-pulse gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-96 rounded-2xl bg-slate-200/70" />
        ))}
      </div>
    );
  }

  const products = ids
    .map((id) => ALL_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50">
          <Heart className="text-rose-500" size={32} aria-hidden="true" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-900">Your wishlist is empty</h2>
        <p className="mt-3 text-slate-600">Tap the heart on any product to save it here for later.</p>
        <div className="mt-8 flex justify-center">
          <Button href="/shop">Browse the shop</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p role="status" className="text-sm text-slate-600">
          <strong className="text-slate-900">{products.length}</strong>{' '}
          {products.length === 1 ? 'saved item' : 'saved items'}
        </p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => products.forEach((p) => addToCart(p))}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-600"
          >
            <ShoppingBag size={16} aria-hidden="true" /> Add all to bag
          </button>
          <button
            type="button"
            onClick={clear}
            className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-rose-600"
          >
            <Trash2 size={16} aria-hidden="true" /> Clear
          </button>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.id} className="flex">
            <div className="w-full">
              <ProductCard product={product} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};