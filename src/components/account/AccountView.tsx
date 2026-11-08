// src/components/account/AccountView.tsx  (replace the whole file)
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, LogOut, PackageOpen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useWishlist } from '@/context/WishlistContext';
import { authClient } from '@/lib/auth-client';
import { formatETB } from '@/lib/format';
import { clearOrderHistory, loadOrderHistory } from '@/lib/orders';
import type { Order } from '@/lib/orders';
import { AuthPanel } from './AuthPanel';
import { OrderList } from './OrderList';

const EmptyOrders: React.FC = () => (
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
);

const Shortcuts: React.FC = () => (
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
);

/** Signed in: orders come from the database. */
const MemberView: React.FC<{ user: { id: string; name: string; email: string } }> = ({ user }) => {
  const { count: wishlistCount } = useWishlist();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/account/orders')
      .then(async (response) => {
        if (!response.ok) throw new Error('Request failed');
        const data = (await response.json()) as { orders: Order[] };
        if (!cancelled) setOrders(data.orders);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [user.id]);

  const counted = (orders ?? []).filter((order) => order.status !== 'cancelled');
  const totalSpent = counted.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Signed in as</p>
          <p className="font-serif text-2xl font-bold text-slate-900">{user.name}</p>
          <p className="text-sm text-slate-600">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={() => authClient.signOut()}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-rose-300 hover:text-rose-600"
        >
          <LogOut size={16} aria-hidden="true" /> Sign out
        </button>
      </div>

      <dl className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Orders', value: orders ? String(counted.length) : '...' },
          { label: 'Total spent', value: orders ? formatETB(totalSpent) : '...' },
          { label: 'Saved to wishlist', value: String(wishlistCount) },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</dt>
            <dd className="mt-2 font-serif text-3xl font-bold text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="orders-title">
        <h2 id="orders-title" className="mb-5 font-serif text-2xl font-bold text-slate-900">
          Your orders
        </h2>

        {loadError ? (
          <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
            We could not load your orders. Please refresh the page.
          </p>
        ) : orders === null ? (
          <div aria-busy="true" className="h-40 animate-pulse rounded-2xl bg-slate-200/70" />
        ) : orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <OrderList orders={orders} />
        )}
      </section>

      <Shortcuts />
    </div>
  );
};

/** Signed out: sign-in form, plus the guest orders saved in this browser. */
const GuestView: React.FC = () => {
  const [localOrders, setLocalOrders] = useState<Order[] | undefined>(undefined);

  useEffect(() => {
    setLocalOrders(loadOrderHistory());
  }, []);

  const clearHistory = () => {
    clearOrderHistory();
    setLocalOrders([]);
  };

  return (
    <div className="space-y-12">
      <div>
        <p className="mx-auto mb-6 max-w-md text-center text-sm leading-6 text-slate-600">
          Sign in to see your orders on any device. You can still check out as a guest.
        </p>
        <AuthPanel />
      </div>

      {localOrders && localOrders.length > 0 && (
        <section aria-labelledby="guest-orders-title">
          <div className="mb-5 flex items-center justify-between">
            <h2 id="guest-orders-title" className="font-serif text-2xl font-bold text-slate-900">
              Guest orders on this device
            </h2>
            <button
              type="button"
              onClick={clearHistory}
              className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-rose-600"
            >
              <Trash2 size={16} aria-hidden="true" /> Clear history
            </button>
          </div>
          <OrderList orders={localOrders} />
        </section>
      )}

      <Shortcuts />
    </div>
  );
};

export const AccountView: React.FC = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div aria-busy="true" className="h-72 animate-pulse rounded-3xl bg-slate-200/70" />;
  }

  return session ? <MemberView user={session.user} /> : <GuestView />;
};