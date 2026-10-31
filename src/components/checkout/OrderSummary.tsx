// src/components/checkout/OrderSummary.tsx
import React from 'react';
import type { OrderItem } from '@/lib/orders';
import { formatETB } from '@/lib/format';

interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  /** Place the submit button (or anything else) at the bottom */
  children?: React.ReactNode;
  className?: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  shipping,
  total,
  children,
  className = '',
}) => {
  return (
    <aside
      aria-label="Order summary"
      className={`h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
      <h2 className="mb-5 font-serif text-xl font-bold text-slate-900">Order Summary</h2>

      <ul className="divide-y divide-slate-100">
        {items.map((item) => (
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
            <p className="text-sm font-bold text-slate-900">{formatETB(item.price * item.quantity)}</p>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-600">Subtotal</dt>
          <dd className="font-semibold text-slate-900">{formatETB(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-600">Shipping</dt>
          <dd className="font-semibold text-slate-900">{shipping === 0 ? 'Free' : formatETB(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
          <dt className="font-bold text-slate-900">Total</dt>
          <dd className="text-lg font-extrabold text-slate-900">{formatETB(total)}</dd>
        </div>
      </dl>

      {children}
    </aside>
  );
};