// src/components/cart/CartItemRow.tsx
'use client';

import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { CartItem } from '@/context/CartContext';
import { formatETB } from '@/lib/format';

export const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-3">
      <img
        src={item.image}
        alt={item.name}
        loading="lazy"
        className="h-20 w-20 shrink-0 rounded-xl bg-white object-cover"
      />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold text-slate-900">{item.name}</h3>
        <p className="mt-0.5 text-xs font-semibold text-rose-600">{formatETB(item.price)}</p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, -1)}
              disabled={item.quantity <= 1}
              aria-label={`Decrease quantity of ${item.name}`}
              className="cursor-pointer rounded-l-lg p-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus size={14} aria-hidden="true" />
            </button>
            <span className="min-w-8 px-2 text-center text-xs font-bold text-slate-800" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, 1)}
              aria-label={`Increase quantity of ${item.name}`}
              className="cursor-pointer rounded-r-lg p-1 text-slate-600 transition-colors hover:bg-slate-100"
            >
              <Plus size={14} aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            aria-label={`Remove ${item.name} from cart`}
            className="cursor-pointer p-1 text-slate-400 transition-colors hover:text-rose-600"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};