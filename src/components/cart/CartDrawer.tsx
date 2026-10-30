// src/components/cart/CartDrawer.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { CartItemRow } from './CartItemRow';
import { FreeShippingProgress } from './FreeShippingProgress';
import { formatETB } from '@/lib/format';

export const CartDrawer: React.FC = () => {
  const { cart, isOpen, setIsOpen, subtotal, totalItems } = useCart();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = () => setIsOpen(false);

  // While open: Escape closes, page behind doesn't scroll, focus moves into the drawer
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, setIsOpen]);

  return (
    <div
      className={`fixed inset-0 z-[60] ${isOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={close}
        className={`absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 motion-reduce:transition-none ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-rose-500" size={22} aria-hidden="true" />
            <h2 id="cart-drawer-title" className="font-serif text-lg font-bold text-slate-900">
              Your Shopping Bag{totalItems > 0 && ` (${totalItems})`}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="cursor-pointer rounded-full p-2 text-slate-400 transition-colors hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <FreeShippingProgress subtotal={subtotal} className="border-b border-rose-100 px-6 py-3" />

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="space-y-4 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-400">
                <ShoppingBag size={28} aria-hidden="true" />
              </div>
              <p className="font-medium text-slate-600">Your shopping bag is empty.</p>
              <Button href="/shop" onClick={close} className="mx-auto px-4 py-2 text-xs">
                Start Shopping
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={item.id}>
                  <CartItemRow item={item} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="space-y-4 border-t border-slate-100 bg-slate-50/50 px-6 py-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="text-lg font-bold text-slate-900">{formatETB(subtotal)}</span>
            </div>
            <p className="text-[11px] text-slate-500">Shipping and taxes calculated at checkout.</p>

            {/* TODO: create app/checkout/page.tsx — this link 404s until then */}
            <Button
              href="/checkout"
              onClick={close}
              className="w-full gap-2 py-3.5 shadow-lg shadow-rose-200"
            >
              Proceed to Checkout <ArrowRight size={16} aria-hidden="true" />
            </Button>

            <Link
              href="/cart"
              onClick={close}
              className="block text-center text-xs font-semibold text-slate-600 underline-offset-4 transition-colors hover:text-rose-600 hover:underline"
            >
              View full cart
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};