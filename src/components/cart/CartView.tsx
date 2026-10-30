// src/components/cart/CartView.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { CartItemRow } from './CartItemRow';
import { FreeShippingProgress } from './FreeShippingProgress';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import { formatETB } from '@/lib/format';

export const CartView: React.FC = () => {
  const { cart, isHydrated, subtotal, totalItems, clearCart } = useCart();

  // Wait for the saved cart to load, otherwise "empty" flashes for a moment
  if (!isHydrated) {
    return (
      <section className="min-h-[60vh] bg-slate-50 py-16" aria-busy="true">
        <div className="mx-auto max-w-5xl animate-pulse space-y-4 px-4">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="h-28 rounded-2xl bg-slate-200" />
          <div className="h-28 rounded-2xl bg-slate-200" />
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="min-h-[60vh] bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50">
            <ShoppingBag className="text-rose-500" size={32} aria-hidden="true" />
          </div>
          <h1 className="font-serif text-3xl font-bold leading-tight text-slate-900">
            Your cart is empty
          </h1>
          <p className="mt-3 text-slate-600">Browse our products and add items to your cart.</p>
          <div className="mt-8 flex justify-center">
            <Button href="/shop">Go to Shop</Button>
          </div>
        </div>
      </section>
    );
  }

  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <section className="min-h-[60vh] bg-slate-50 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-serif text-3xl font-bold text-slate-900">
          Shopping Cart <span className="text-lg font-normal text-slate-500">({totalItems} items)</span>
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="space-y-4 lg:col-span-2">
            <FreeShippingProgress subtotal={subtotal} className="rounded-2xl border border-rose-100 px-5 py-4" />

            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={item.id}>
                  <CartItemRow item={item} />
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between pt-2 text-sm">
              <Link href="/shop" className="font-semibold text-slate-700 transition-colors hover:text-rose-600">
                ← Continue shopping
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="cursor-pointer text-slate-500 underline-offset-4 transition-colors hover:text-rose-600 hover:underline"
              >
                Clear cart
              </button>
            </div>
          </div>

          {/* Order summary */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <h2 className="mb-4 font-serif text-lg font-bold text-slate-900">Order Summary</h2>

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600">Subtotal</dt>
                <dd className="font-semibold text-slate-900">{formatETB(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Shipping</dt>
                <dd className="font-semibold text-slate-900">
                  {freeShipping ? 'Free' : 'Calculated at checkout'}
                </dd>
              </div>
            </dl>

            {/* TODO: create app/checkout/page.tsx — this link 404s until then */}
            <Button href="/checkout" className="mt-6 w-full gap-2 py-3.5 shadow-lg shadow-rose-200">
              Proceed to Checkout <ArrowRight size={16} aria-hidden="true" />
            </Button>
            <p className="mt-3 text-center text-[11px] text-slate-500">
              Taxes calculated at checkout.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
};