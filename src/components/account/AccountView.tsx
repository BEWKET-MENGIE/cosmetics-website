// src/components/account/AccountView.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, PackageOpen, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatDate } from '@/lib/date';
import { formatETB } from '@/lib/format';
import { PAYMENT_METHODS, clearOrderHistory, loadOrderHistory } from '@/lib/orders';
import type { Order } from '@/lib/orders';

export const AccountView: React.FC = () => {
  const { addToCart } = useCart();
  const { count: wishlistCount } = useWishlist();

  // undefined = still loading from the browser
  const [orders, setOrders] = useState<Order[] | undefined>(undefined);

  useEffect(() => {
    setOrders(loadOrderHistory());
  }, []);

  const clearHistory = () => {
    clearOrderHistory();
    setOrders([]);
  };

  const orderAgain = (order: Order) => {
    order.items.forEach((item) =>
      addToCart({ id: item.id, name: item.name, price: item.price, image: item.image }, item.quantity),
    );
  };

  if (orders === undefined) {
    return <div aria-busy="true" className="h-72 animate-pulse rounded-3xl bg-slate-200/70" />;
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const stats = [
    { label: 'Orders on this device', value: String(orders.length) },
    { label: 'Total spent', value: formatETB(totalSpent) },
    { label: 'Saved to wishlist', value: String(wishlistCount) },
  ];

  return (
    <div className="space-y-10">
      {/* Notice */}
      <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 text-sm leading-6 text-slate-700">
        <strong className="text-slate-900">You are shopping as a guest.</strong> Accounts with sign-in
        are coming soon. Until then, the orders you place are listed below, saved only in this
        browser.
      </div>

      {/* Stats */}
      <dl className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</dt>
            <dd className="mt-2 font-serif text-3xl font-bold text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>

      {/* Orders */}
      <section aria-labelledby="orders-title">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="orders-title" className="font-serif text-2xl font-bold text-slate-900">
            Your orders
          </h2>
          {orders.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-rose-600"
            >
              <Trash2 size={16} aria-hidden="true" /> Clear history
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
              <PackageOpen className="text-rose-500" size={28} aria-hidden="true" />
            </div>
            <p className="font-serif text-xl font-bold text-slate-900">No orders yet</p>
            <p className="mt-2 text-sm text-slate-600">Once you place an order it will show up here.</p>
            <div className="mt-6 flex justify-center">
              <Button href="/shop">Start shopping</Button>
            </div>
          </div>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => {
              const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
              const payment = PAYMENT_METHODS.find((p) => p.value === order.paymentMethod);

              return (
                <li key={order.id}>
                  <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm open:shadow-md">
                    <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 rounded-2xl px-6 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 [&::-webkit-details-marker]:hidden">
                      <div>
                        <p className="font-semibold text-slate-900">{order.id}</p>
                        <p className="text-xs text-slate-500">
                          <time dateTime={order.placedAt}>{formatDate(order.placedAt)}</time> · {itemCount}{' '}
                          {itemCount === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-slate-900">{formatETB(order.total)}</p>
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition-transform duration-300 group-open:rotate-45"
                        >
                          <Plus size={16} />
                        </span>
                      </div>
                    </summary>

                    <div className="border-t border-slate-100 px-6 pb-6 pt-5">
                      <ul className="divide-y divide-slate-100">
                        {order.items.map((item) => (
                          <li key={item.id} className="flex items-center gap-4 py-3">
                            <img
                              src={item.image}
                              alt=""
                              loading="lazy"
                              className="h-14 w-14 shrink-0 rounded-xl bg-slate-100 object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                              <p className="text-xs text-slate-500">
                                {item.quantity} × {formatETB(item.price)}
                              </p>
                            </div>
                            <p className="text-sm font-bold text-slate-900">
                              {formatETB(item.price * item.quantity)}
                            </p>
                          </li>
                        ))}
                      </ul>

                      <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="font-semibold text-slate-500">Delivered to</dt>
                          <dd className="text-slate-900">
                            {order.address.details}, {order.address.city}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-slate-500">Payment</dt>
                          <dd className="text-slate-900">{payment?.label ?? order.paymentMethod}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-slate-500">Shipping</dt>
                          <dd className="text-slate-900">
                            {order.shipping === 0 ? 'Free' : formatETB(order.shipping)}
                          </dd>
                        </div>
                      </dl>

                      <button
                        type="button"
                        onClick={() => orderAgain(order)}
                        className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-rose-500 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-600"
                      >
                        <RotateCcw size={16} aria-hidden="true" /> Order again
                      </button>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Shortcuts */}
      <nav aria-label="Account shortcuts" className="flex flex-wrap gap-3">
        <Link
          href="/wishlist"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-rose-300 hover:text-rose-600"
        >
          <Heart size={16} aria-hidden="true" /> My wishlist
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-rose-300 hover:text-rose-600"
        >
          Need help with an order?
        </Link>
      </nav>
    </div>
  );
};