// app/api/admin/orders/[number]/route.ts
import { db } from '@/lib/db';
import { requireAdmin } from '@/server/admin';
import { orderActionSchema } from '@/server/adminSchemas';
import { notifyOrderStatus, notifyPaymentReceived } from '@/server/email/notify';
import { sendInBackground } from '@/server/email/send';
import { json, readJson } from '@/server/http';
import { toClientOrder } from '@/server/orders';

interface RouteContext {
  params: Promise<{ number: string }>;
}

class ConflictError extends Error {}

const conflict = (message: string) => json({ code: 'conflict', error: message }, 409);

export async function PATCH(request: Request, { params }: RouteContext) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const { number } = await params;
  const parsed = orderActionSchema.safeParse(await readJson(request));
  if (!parsed.success) return json({ code: 'validation', error: 'Unknown action.' }, 400);

  const order = await db.order.findUnique({ where: { number }, include: { items: true } });
  if (!order) return json({ code: 'not_found', error: 'Order not found.' }, 404);

  const action = parsed.data.action;

  try {
    if (action === 'mark_paid') {
      if (order.status === 'cancelled') return conflict('A cancelled order cannot be paid.');
      if (order.paymentStatus === 'paid') return conflict('This order is already paid.');

      await db.order.updateMany({
        where: { id: order.id, paymentStatus: { not: 'paid' }, status: 'pending' },
        data: { paymentStatus: 'paid', status: 'paid' },
      });
      await db.order.updateMany({
        where: { id: order.id, paymentStatus: { not: 'paid' } },
        data: { paymentStatus: 'paid' },
      });
    }

    if (action === 'ship') {
      if (order.status !== 'pending' && order.status !== 'paid') return conflict('This order cannot be shipped now.');
      if (order.paymentMethod !== 'cod' && order.paymentStatus !== 'paid') {
        return conflict('This order is not paid yet. Mark the payment received first.');
      }
      const result = await db.order.updateMany({
        where: { id: order.id, status: { in: ['pending', 'paid'] } },
        data: { status: 'shipped' },
      });
      if (result.count !== 1) return conflict('The order just changed. Please refresh.');
    }

    if (action === 'deliver') {
      if (order.status !== 'shipped') return conflict('Only a shipped order can be marked delivered.');
      const result = await db.order.updateMany({
        where: { id: order.id, status: 'shipped' },
        // Cash on delivery: the money is collected at the door
        data: order.paymentMethod === 'cod' ? { status: 'delivered', paymentStatus: 'paid' } : { status: 'delivered' },
      });
      if (result.count !== 1) return conflict('The order just changed. Please refresh.');
    }

    if (action === 'cancel') {
      if (order.status !== 'pending' && order.status !== 'paid') {
        return conflict('Only orders that have not shipped can be cancelled.');
      }
      // All or nothing: mark cancelled and put the items back in stock
      await db.$transaction(async (tx) => {
        const result = await tx.order.updateMany({
          where: { id: order.id, status: { in: ['pending', 'paid'] } },
          data: { status: 'cancelled' },
        });
        if (result.count !== 1) throw new ConflictError();

        for (const item of order.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }
      });
    }
  } catch (error) {
    if (error instanceof ConflictError) return conflict('The order just changed. Please refresh.');
    console.error('Admin order action failed', error);
    return json({ code: 'server', error: 'Something went wrong. Please try again.' }, 500);
  }

  const fresh = await db.order.findUnique({ where: { number }, include: { items: true } });
  if (!fresh) return json({ code: 'not_found', error: 'Order not found.' }, 404);
  const clientOrder = toClientOrder(fresh);

  // Tell the customer
  if (action === 'ship') sendInBackground(() => notifyOrderStatus(clientOrder, 'shipped'));
  if (action === 'deliver') sendInBackground(() => notifyOrderStatus(clientOrder, 'delivered'));
  if (action === 'cancel') sendInBackground(() => notifyOrderStatus(clientOrder, 'cancelled'));
  if (action === 'mark_paid' && order.paymentMethod !== 'cod') {
    sendInBackground(() => notifyPaymentReceived(clientOrder));
  }

  return json({ order: clientOrder });
}