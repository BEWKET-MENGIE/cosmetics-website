// src/components/Shop/ProductDetail.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, Heart, Minus, Plus, RotateCcw, ShoppingBag, Star, Truck } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import { formatETB } from '@/lib/format';

interface ProductDetailProps {
  product: Product;
}

const SUMMARY_CLASS =
  'flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-slate-900 transition-colors hover:text-rose-600 [&::-webkit-details-marker]:hidden';

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { has, toggle } = useWishlist();
  const liked = has(product.id);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Image */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100 shadow-sm">
        <div className="aspect-square">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="absolute left-4 top-4 flex flex-col gap-1.5">
          {product.isBestSeller && (
            <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow">
              Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow">New</span>
          )}
        </div>
      </div>

      {/* Info */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-rose-600">{product.category}</p>
        <h1 className="mt-2 font-serif text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
          {product.name}
        </h1>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <Star size={18} className="fill-amber-400 text-amber-400" aria-hidden="true" />
          <span className="font-semibold text-slate-800">{product.rating.toFixed(1)}</span>
          <span className="text-slate-500">({product.reviewsCount} reviews)</span>
        </div>

        <p className="mt-6 text-3xl font-extrabold text-slate-900">{formatETB(product.price)}</p>
        <p className="mt-5 leading-7 text-slate-600">{product.description}</p>

        {/* Quantity + actions */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-full border border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="cursor-pointer rounded-l-full p-3.5 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus size={16} aria-hidden="true" />
            </button>
            <span className="min-w-12 text-center font-bold" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              aria-label="Increase quantity"
              className="cursor-pointer rounded-r-full p-3.5 text-slate-600 transition-colors hover:bg-slate-100"
            >
              <Plus size={16} aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex min-w-48 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-rose-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-rose-200 transition-colors hover:bg-rose-600"
          >
            {added ? <Check size={18} aria-hidden="true" /> : <ShoppingBag size={18} aria-hidden="true" />}
            {added ? 'Added to bag' : 'Add to Bag'}
          </button>

          <button
            type="button"
            onClick={() => toggle(product.id)}
            aria-pressed={liked}
            aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
            className="cursor-pointer rounded-full border border-slate-200 bg-white p-4 text-slate-600 transition-colors hover:text-rose-500"
          >
            <Heart size={20} className={liked ? 'fill-rose-500 text-rose-500' : ''} />
          </button>
        </div>

        {/* Perks */}
        <ul className="mt-8 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <li className="flex items-center gap-3 rounded-2xl bg-rose-50 p-4">
            <Truck size={20} className="shrink-0 text-rose-600" aria-hidden="true" />
            Free shipping over {formatETB(FREE_SHIPPING_THRESHOLD)}
          </li>
          <li className="flex items-center gap-3 rounded-2xl bg-rose-50 p-4">
            <RotateCcw size={20} className="shrink-0 text-rose-600" aria-hidden="true" />
            30-day returns
          </li>
        </ul>

        {/* Details */}
        <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          <details className="group" name="product-info">
            <summary className={SUMMARY_CLASS}>
              Shipping &amp; delivery
              <Plus size={16} aria-hidden="true" className="transition-transform group-open:rotate-45" />
            </summary>
            <p className="px-5 pb-4 text-sm leading-6 text-slate-600">
              Orders ship within 1 to 2 business days and usually arrive in 2 to 5 business days.{' '}
              <Link href="/legal/shipping" className="font-semibold text-rose-600 hover:underline">
                Shipping policy
              </Link>
            </p>
          </details>
          <details className="group" name="product-info">
            <summary className={SUMMARY_CLASS}>
              Returns
              <Plus size={16} aria-hidden="true" className="transition-transform group-open:rotate-45" />
            </summary>
            <p className="px-5 pb-4 text-sm leading-6 text-slate-600">
              Not happy? Return it within 30 days of delivery for a refund or exchange.{' '}
              <Link href="/legal/returns" className="font-semibold text-rose-600 hover:underline">
                Returns policy
              </Link>
            </p>
          </details>
          <details className="group" name="product-info">
            <summary className={SUMMARY_CLASS}>
              Skin sensitivity
              <Plus size={16} aria-hidden="true" className="transition-transform group-open:rotate-45" />
            </summary>
            <p className="px-5 pb-4 text-sm leading-6 text-slate-600">
              Everyone&apos;s skin is different. Patch test on your inner arm before first use and stop if
              you notice redness or itching.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
};