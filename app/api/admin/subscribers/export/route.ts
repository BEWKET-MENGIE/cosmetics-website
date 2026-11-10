// app/api/admin/subscribers/export/route.ts
import { db } from '@/lib/db';
import { requireAdmin } from '@/server/admin';

// Quote every cell, and defuse values a spreadsheet would run as a formula
const csvCell = (value: string) => {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
};

export async function GET(request: Request) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const rows = await db.subscriber.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } });
  const csv = [
    'email,subscribed_at',
    ...rows.map((row) => `${csvCell(row.email)},${csvCell(row.createdAt.toISOString())}`),
  ].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="subscribers.csv"',
      'Cache-Control': 'no-store',
    },
  });
}