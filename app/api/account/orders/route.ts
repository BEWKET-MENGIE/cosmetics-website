// app/api/account/orders/route.ts
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { json } from '@/server/http';
import { toClientOrder } from '@/server/orders';

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return json({ code: 'unauthorized', error: 'Please sign in.' }, 401);

  const rows = await db.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
    take: 50,
  });

  return json({ orders: rows.map(toClientOrder) });
}