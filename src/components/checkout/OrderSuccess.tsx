// src/components/checkout/OrderSuccess.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, PackageCheck, PhoneCall, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PAYMENT_METHODS, loadLastOrder } from '@/lib/orders';
import type { Order } from '@/lib/orders';
import { formatDate } from '@/lib/date';
import { OrderSummary } from './OrderSummary';

const NEXT_STEPS = [
  { Icon: PhoneCall, title: 'We confirm', text: 'We contact you to confirm your order and payment.' },
  { Icon: PackageCheck, title: 'We pack it', text: 'Your order ships within 1 to 2 business days.' },
  { Icon: Truck, title: 'It arrives', text: 'Delivery usually takes 2 to 5 business days.' },
];

export const OrderSuccess: React.FC = () => {
  // undefined = still loading, null = nothing found
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    setOrder(loadLastOrder());
  }, []);

  if (order === undefined) {
    return <div aria-busy="true" className="mx-auto h-96 max-w-3xl animate-pulse rounded-3xl bg-slate-200/70" />;
  }

  if (order === null) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="font-serif text-3xl font-bold text-slate-900">No recent order found</h1>
        <p className="mt-3 text-slate-600">
          If you just placed an order, keep this browser tab open until you see your confirmation.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/shop">Continue shopping</Button>
        </div>
      </div>
    );
  }

  const payment = PAYMENT_METHODS.find((p) => p.value === order.paymentMethod);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="text-emerald-500" size={44} aria-hidden="true" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-slate-900 sm:text-5xl">Thank you for your order!</h1>
        <p className="mt-3 text-slate-600">
          Order <strong className="text-slate-900">{order.id}</strong> placed on{' '}
          <time dateTime={order.placedAt}>{formatDate(order.placedAt)}</time>.
        </p>
      </div>

      <ol className="mt-12 grid gap-4 sm:grid-cols-3">
        {NEXT_STEPS.map(({ Icon, title, text }, index) => (
          <li key={title} className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Icon size={22} aria-hidden="true" />
            </span>
            <p className="font-semibold text-slate-900">
              <span className="sr-only">Step {index + 1}: </span>
              {title}
            </p>
            <p className="mt-1 text-sm text-slate-600">{text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-serif text-xl font-bold text-slate-900">Delivery details</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-slate-500">Name</dt>
              <dd className="text-slate-900">{order.customer.fullName}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Phone</dt>
              <dd className="text-slate-900">{order.customer.phone}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Address</dt>
              <dd className="text-slate-900">
                {order.address.details}, {order.address.city}
              </dd>
            </div>
            {order.address.notes && (
              <div>
                <dt className="font-semibold text-slate-500">Notes</dt>
                <dd className="text-slate-900">{order.address.notes}</dd>
              </div>
            )}
            <div>
              <dt className="font-semibold text-slate-500">Payment</dt>
              <dd className="text-slate-900">{payment?.label ?? order.paymentMethod}</dd>
            </div>
          </dl>
        </section>

        <OrderSummary
          items={order.items}
          subtotal={order.subtotal}
          shipping={order.shipping}
          total={order.total}
        />
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button href="/shop">Continue shopping</Button>
        <Button href="/" variant="outline">
          Back to home
        </Button>
      </div>
    </div>
  );
};