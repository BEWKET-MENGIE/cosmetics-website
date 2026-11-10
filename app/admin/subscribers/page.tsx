// app/admin/subscribers/page.tsx
import { AdminHeading, EmptyState, PRIMARY_BUTTON, StatCard, StatusBadge, TABLE_WRAP, TD, TH } from '@/components/admin/AdminUi';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/date';

export default async function AdminSubscribersPage() {
  const [active, total, rows] = await Promise.all([
    db.subscriber.count({ where: { isActive: true } }),
    db.subscriber.count(),
    db.subscriber.findMany({ orderBy: { createdAt: 'desc' }, take: 200 }),
  ]);

  return (
    <div>
      <AdminHeading
        title="Subscribers"
        description="People who joined the newsletter."
        actions={
          // A plain link: the browser sends your sign-in cookie, and the route checks you are an admin
          <a href="/api/admin/subscribers/export" className={PRIMARY_BUTTON}>
            Download CSV (active)
          </a>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Active" value={String(active)} />
        <StatCard label="Unsubscribed" value={String(total - active)} />
        <StatCard label="Total" value={String(total)} />
      </div>

      {rows.length === 0 ? (
        <EmptyState>No subscribers yet.</EmptyState>
      ) : (
        <div className={TABLE_WRAP}>
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr>
                <th className={TH}>Email</th>
                <th className={TH}>Joined</th>
                <th className={TH}>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className={TD}>{row.email}</td>
                  <td className={TD}>{formatDate(row.createdAt.toISOString())}</td>
                  <td className={TD}>
                    <StatusBadge status={row.isActive ? 'active' : 'hidden'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}