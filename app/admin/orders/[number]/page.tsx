// app/admin/orders/[number]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OrderActions } from '@/components/admin/OrderActions';
import { AdminHeading, StatusBadge } from '@/components/admin/AdminUi';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/date';
import { formatETB } from '@/lib/format';
import { PAYMENT_METHODS } from '@/lib/orders';

interface OrderPageProps {
  params: Promise<{ number: string }>;
}

export default async function AdminOrderPage({ params }: OrderPageProps) {
  const { number } = await params;

  const order = await db.order.findUnique({
    where: { number },
    include: { items: true, user: { select: { email: true, name: true } } },
  });
  if (!order) notFound();

  const payment = PAYMENT_METHODS.find((method) => method.value === order.paymentMethod);
  const detail = 'text-sm text-slate-900';
  const label = 'text-xs font-bold uppercase tracking-wider text-slate-500';

  return (
    <div className="space-y-8">
      <Link href="/admin/orders" className="text-sm font-semibold text-slate-600 hover:text-rose-600">
        ← All orders
      </Link>

      <AdminHeading
        title={order.number}
        description={`Placed on ${formatDate(order.createdAt.toISOString())}`}
        actions={
          <div className="flex gap-2">
            <StatusBadge status={order.status} />
            <StatusBadge status={order.paymentStatus} />
          </div>
        }
      />

      <section aria-labelledby="actions-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 id="actions-title" className="mb-4 font-serif text-xl font-bold text-slate-900">
          Actions
        </h2>
        <OrderActions
          number={order.number}
          status={order.status}
          paymentStatus={order.paymentStatus}
          paymentMethod={order.paymentMethod}
        />
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="customer-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 id="customer-title" className="mb-4 font-serif text-xl font-bold text-slate-900">
            Customer
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className={label}>Name</dt>
              <dd className={detail}>{order.fullName}</dd>
            </div>
            <div>
              <dt className={label}>Phone</dt>
              <dd className={detail}>
                <a href={`tel:${order.phone}`} className="text-rose-600 hover:underline">
                  {order.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className={label}>Email</dt>
              <dd className={detail}>{order.email ?? 'None'}</dd>
            </div>
            <div>
              <dt className={label}>Account</dt>
              <dd className={detail}>{order.user ? order.user.email : 'Guest checkout'}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="delivery-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 id="delivery-title" className="mb-4 font-serif text-xl font-bold text-slate-900">
            Delivery and payment
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className={label}>Address</dt>
              <dd className={detail}>
                {order.address}, {order.city}
              </dd>
            </div>
            <div>
              <dt className={label}>Notes</dt>
              <dd className={detail}>{order.notes ?? 'None'}</dd>
            </div>
            <div>
              <dt className={label}>Payment method</dt>
              <dd className={detail}>{payment?.label ?? order.paymentMethod}</dd>
            </div>
            {order.paymentRef && (
              <div>
                <dt className={label}>Payment reference</dt>
                <dd className={`${detail} break-all`}>{order.paymentRef}</dd>
              </div>
            )}
          </dl>
        </section>
      </div>

      <section aria-labelledby="items-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 id="items-title" className="mb-4 font-serif text-xl font-bold text-slate-900">
          Items
        </h2>
        <ul className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-3">
              <img src={item.image} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-xl bg-slate-100 object-cover" />
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
            <dd className="font-semibold">{formatETB(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">Shipping</dt>
            <dd className="font-semibold">{order.shipping === 0 ? 'Free' : formatETB(order.shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
            <dt className="font-bold">Total</dt>
            <dd className="text-lg font-extrabold">{formatETB(order.total)}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}