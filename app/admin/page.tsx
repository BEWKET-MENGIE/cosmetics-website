// app/admin/page.tsx
import Link from 'next/link';
import { connection } from 'next/server';
import { AdminHeading, StatCard, StatusBadge, TABLE_WRAP, TD, TH } from '@/components/admin/AdminUi';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/date';
import { formatETB } from '@/lib/format';

const LOW_STOCK_LIMIT = 5;

export default async function AdminDashboardPage() {
  await connection(); // we use the current time below, so this page is rendered per request

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [toProcess, today, revenue, lowStock, newMessages, subscribers, recent] = await Promise.all([
    db.order.count({ where: { status: { in: ['pending', 'paid'] } } }),
    db.order.count({ where: { createdAt: { gte: startOfToday } } }),
    db.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'paid' } }),
    db.product.findMany({
      where: { isActive: true, stock: { lte: LOW_STOCK_LIMIT } },
      orderBy: { stock: 'asc' },
      take: 8,
      select: { id: true, name: true, stock: true },
    }),
    db.contactMessage.count({ where: { status: 'new' } }),
    db.subscriber.count({ where: { isActive: true } }),
    db.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { number: true, createdAt: true, fullName: true, total: true, status: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <AdminHeading title="Dashboard" description="What needs your attention today." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Orders to process" value={String(toProcess)} hint="Pending or paid, not shipped yet" warn={toProcess > 0} />
        <StatCard label="Orders today" value={String(today)} />
        <StatCard label="Paid revenue" value={formatETB(revenue._sum.total ?? 0)} hint="All time, paid orders only" />
        <StatCard label="Low stock" value={String(lowStock.length)} hint={`${LOW_STOCK_LIMIT} or fewer left`} warn={lowStock.length > 0} />
        <StatCard label="New messages" value={String(newMessages)} warn={newMessages > 0} />
        <StatCard label="Subscribers" value={String(subscribers)} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-labelledby="recent-title">
          <h2 id="recent-title" className="mb-3 font-serif text-xl font-bold text-slate-900">
            Recent orders
          </h2>
          <div className={TABLE_WRAP}>
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr>
                  <th className={TH}>Order</th>
                  <th className={TH}>Customer</th>
                  <th className={TH}>Total</th>
                  <th className={TH}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((order) => (
                  <tr key={order.number}>
                    <td className={TD}>
                      <Link href={`/admin/orders/${order.number}`} className="font-semibold text-rose-600 hover:underline">
                        {order.number}
                      </Link>
                      <p className="text-xs text-slate-500">{formatDate(order.createdAt.toISOString())}</p>
                    </td>
                    <td className={TD}>{order.fullName}</td>
                    <td className={TD}>{formatETB(order.total)}</td>
                    <td className={TD}>
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/admin/orders" className="mt-3 inline-block text-sm font-semibold text-rose-600 hover:underline">
            See all orders
          </Link>
        </section>

        <section aria-labelledby="stock-title">
          <h2 id="stock-title" className="mb-3 font-serif text-xl font-bold text-slate-900">
            Running low
          </h2>
          {lowStock.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
              Every product has enough stock.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm">
              {lowStock.map((product) => (
                <li key={product.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <Link href={`/admin/products/${product.id}`} className="font-semibold text-slate-800 hover:text-rose-600">
                    {product.name}
                  </Link>
                  <span className={`font-bold ${product.stock === 0 ? 'text-rose-600' : 'text-amber-600'}`}>
                    {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}