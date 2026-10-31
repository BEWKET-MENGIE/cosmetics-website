// src/components/ui/ProductCard.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, Heart, Eye } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatETB } from '@/lib/format';
import { productHref } from '@/lib/products';
import { ProductModal } from './ProductModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { has, toggle } = useWishlist();
  const liked = has(product.id);

  return (
    <>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-rose-100/60 bg-white shadow-sm transition-all duration-500 hover:shadow-xl">
        {/* Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
          {product.isBestSeller && (
            <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => toggle(product.id)}
          aria-pressed={liked}
          aria-label={liked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute right-3 top-3 z-10 cursor-pointer rounded-full bg-white/80 p-2 text-slate-600 shadow-sm backdrop-blur-md transition-colors hover:text-rose-500"
        >
          <Heart size={18} className={liked ? 'fill-rose-500 text-rose-500' : ''} />
        </button>

        {/* Image = quick view trigger */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          aria-haspopup="dialog"
          aria-label={`Quick view: ${product.name}`}
          className="group/quick relative block h-64 w-full cursor-pointer overflow-hidden bg-slate-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-rose-500"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover/quick:opacity-100 group-focus-visible/quick:opacity-100"
          >
            <span className="flex translate-y-2 items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-slate-800 shadow-md backdrop-blur-md transition-transform group-hover/quick:translate-y-0 group-focus-visible/quick:translate-y-0">
              <Eye size={14} /> Quick View
            </span>
          </span>
        </button>

        {/* Details */}
        <div className="flex-1 p-5">
          <span className="text-xs font-semibold text-rose-500">{product.category}</span>
          <h3 className="mt-1 line-clamp-1 text-base font-bold text-slate-800 transition-colors group-hover:text-rose-600">
            <Link
              href={productHref(product)}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            >
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{product.description}</p>

          <div className="mt-3 flex items-center gap-1">
            <Star size={14} className="fill-amber-400 text-amber-400" aria-hidden="true" />
            <span className="text-sm font-semibold text-slate-700">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-500">({product.reviewsCount} reviews)</span>
          </div>
        </div>

        {/* Price & action */}
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <div>
              <span className="block text-xs text-slate-500">Price</span>
              <span className="text-lg font-extrabold text-slate-900">{formatETB(product.price)}</span>
            </div>
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition-all duration-300 hover:bg-rose-500 hover:text-white"
            >
              <ShoppingBag size={16} aria-hidden="true" />
              Order Now
            </button>
          </div>
        </div>
      </article>

      {isModalOpen && <ProductModal product={product} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};