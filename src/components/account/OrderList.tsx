// src/components/account/OrderList.tsx
'use client';

import React, { useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatDate } from '@/lib/date';
import { formatETB } from '@/lib/format';
import { PAYMENT_METHODS } from '@/lib/orders';
import type { Order } from '@/lib/orders';
import { postJson } from '@/lib/api';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-emerald-100 text-emerald-800',
  shipped: 'bg-sky-100 text-sky-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-slate-200 text-slate-700',
};

interface OrderListProps {
  orders: Order[];
}

export const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  const { addToCart } = useCart();
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payError, setPayError] = useState('');

  const needsPayment = (order: Order) =>
    order.paymentMethod === 'chapa' && order.paymentStatus !== 'paid' && order.status !== 'cancelled';

  const payNow = async (order: Order) => {
    setPayingId(order.id);
    setPayError('');
    const result = await postJson<{ checkoutUrl: string }>('/api/payments/retry', { number: order.id });
    if (!result.ok) {
      setPayError(result.error);
      setPayingId(null);
      return;
    }
    window.location.assign(result.data.checkoutUrl);
  };

  const orderAgain = (order: Order) => {
    order.items.forEach((item) =>
      addToCart({ id: item.id, name: item.name, price: item.price, image: item.image }, item.quantity),
    );
  };

  return (
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
                  {order.status && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        STATUS_STYLES[order.status] ?? 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  )}
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
                    <dd className="text-slate-900">
                      {payment?.label ?? order.paymentMethod}
                      {order.paymentStatus ? ` (${order.paymentStatus})` : ''}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">Shipping</dt>
                    <dd className="text-slate-900">
                      {order.shipping === 0 ? 'Free' : formatETB(order.shipping)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {needsPayment(order) && (
                    <button
                      type="button"
                      onClick={() => payNow(order)}
                      disabled={payingId === order.id}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {payingId === order.id ? 'Starting...' : 'Pay now'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => orderAgain(order)}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-rose-500 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-600"
                  >
                    <RotateCcw size={16} aria-hidden="true" /> Order again
                  </button>
                </div>
                {payError && <p role="alert" className="mt-3 text-sm text-rose-600">{payError}</p>}
              </div>
            </details>
          </li>
        );
      })}
    </ul>
  );
};