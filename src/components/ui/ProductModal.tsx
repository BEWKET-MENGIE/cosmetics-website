// src/components/ui/ProductModal.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Star, X } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatETB } from '@/lib/format';
import { productHref } from '@/lib/products';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Escape closes, Tab stays inside, page behind doesn't scroll, focus returns on close
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;

      const items = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  const handleAdd = () => {
    addToCart(product, quantity); // also opens the cart drawer
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-xs" aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        className="relative grid max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:grid-cols-2 sm:rounded-3xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-4 top-4 z-10 cursor-pointer rounded-full bg-white/90 p-2 text-slate-600 shadow transition-colors hover:text-slate-900"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="aspect-square bg-slate-100 sm:aspect-auto sm:min-h-[420px]">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-600">{product.category}</p>
          <h2 id="quick-view-title" className="mt-2 font-serif text-2xl font-bold leading-snug text-slate-900">
            {product.name}
          </h2>

          <div className="mt-3 flex items-center gap-1.5 text-sm">
            <Star size={16} className="fill-amber-400 text-amber-400" aria-hidden="true" />
            <span className="font-semibold text-slate-800">{product.rating.toFixed(1)}</span>
            <span className="text-slate-500">({product.reviewsCount} reviews)</span>
          </div>

          <p className="mt-4 text-2xl font-extrabold text-slate-900">{formatETB(product.price)}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{product.description}</p>

          <div className="mt-auto space-y-3 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="cursor-pointer rounded-l-xl p-3 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus size={16} aria-hidden="true" />
                </button>
                <span className="min-w-10 text-center text-sm font-bold" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  aria-label="Increase quantity"
                  className="cursor-pointer rounded-r-xl p-3 text-slate-600 transition-colors hover:bg-slate-100"
                >
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-600"
              >
                <ShoppingBag size={16} aria-hidden="true" /> Add to Bag
              </button>
            </div>

            <Link
              href={productHref(product)}
              onClick={onClose}
              className="block text-center text-sm font-semibold text-slate-600 underline-offset-4 transition-colors hover:text-rose-600 hover:underline"
            >
              View full details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};