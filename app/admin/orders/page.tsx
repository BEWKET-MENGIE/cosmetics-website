// app/admin/orders/page.tsx
import Link from 'next/link';
import { AdminHeading, EmptyState, StatusBadge, TABLE_WRAP, TD, TH } from '@/components/admin/AdminUi';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/date';
import { formatETB } from '@/lib/format';

const STATUSES = ['all', 'pending', 'paid', 'shipped', 'delivered', 'cancelled'];
const PAGE_SIZE = 15;

interface OrdersPageProps {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}

function hrefFor(params: { status?: string; q?: string; page?: number }) {
  const search = new URLSearchParams();
  if (params.status && params.status !== 'all') search.set('status', params.status);
  if (params.q) search.set('q', params.q);
  if (params.page && params.page > 1) search.set('page', String(params.page));
  const query = search.toString();
  return query ? `/admin/orders?${query}` : '/admin/orders';
}

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status ?? '') ? (sp.status as string) : 'all';
  const q = (sp.q ?? '').trim().slice(0, 80);
  const page = Math.max(1, Number.parseInt(sp.page ?? '1', 10) || 1);

  const where = {
    ...(status !== 'all' ? { status } : {}),
    ...(q
      ? {
          OR: [
            { number: { contains: q } },
            { fullName: { contains: q } },
            { phone: { contains: q } },
            { email: { contains: q } },
          ],
        }
      : {}),
  };

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        number: true,
        createdAt: true,
        fullName: true,
        phone: true,
        total: true,
        status: true,
        paymentMethod: true,
        paymentStatus: true,
        _count: { select: { items: true } },
      },
    }),
    db.order.count({ where }),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <AdminHeading title="Orders" description={`${total} ${total === 1 ? 'order' : 'orders'} found`} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
          {STATUSES.map((value) => (
            <Link
              key={value}
              href={hrefFor({ status: value, q })}
              aria-current={status === value ? 'true' : undefined}
              className={`rounded-full border px-4 py-2 text-xs font-bold capitalize transition-colors ${
                status === value
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-rose-300'
              }`}
            >
              {value}
            </Link>
          ))}
        </nav>

        <form action="/admin/orders" method="get" role="search" className="flex gap-2">
          {status !== 'all' && <input type="hidden" name="status" value={status} />}
          <label htmlFor="order-search" className="sr-only">
            Search orders
          </label>
          <input
            id="order-search"
            name="q"
            defaultValue={q}
            placeholder="Number, name, phone, email"
            className="w-64 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-2 focus:outline-rose-500"
          />
          <button type="submit" className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
            Search
          </button>
        </form>
      </div>

      {orders.length === 0 ? (
        <EmptyState>No orders match these filters.</EmptyState>
      ) : (
        <div className={TABLE_WRAP}>
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr>
                <th className={TH}>Order</th>
                <th className={TH}>Customer</th>
                <th className={TH}>Items</th>
                <th className={TH}>Total</th>
                <th className={TH}>Payment</th>
                <th className={TH}>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.number}>
                  <td className={TD}>
                    <Link href={`/admin/orders/${order.number}`} className="font-semibold text-rose-600 hover:underline">
                      {order.number}
                    </Link>
                    <p className="text-xs text-slate-500">{formatDate(order.createdAt.toISOString())}</p>
                  </td>
                  <td className={TD}>
                    {order.fullName}
                    <p className="text-xs text-slate-500">{order.phone}</p>
                  </td>
                  <td className={TD}>{order._count.items}</td>
                  <td className={TD}>{formatETB(order.total)}</td>
                  <td className={TD}>
                    <p className="mb-1 text-xs uppercase text-slate-500">{order.paymentMethod}</p>
                    <StatusBadge status={order.paymentStatus} />
                  </td>
                  <td className={TD}>
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="Pages" className="mt-6 flex items-center justify-between text-sm">
          {page > 1 ? (
            <Link href={hrefFor({ status, q, page: page - 1 })} className="font-semibold text-rose-600 hover:underline">
              Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="text-slate-500">
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Link href={hrefFor({ status, q, page: page + 1 })} className="font-semibold text-rose-600 hover:underline">
              Next
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}