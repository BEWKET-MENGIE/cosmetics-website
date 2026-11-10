// src/server/payments.ts
import { notifyPaymentReceived } from '@/server/email/notify';
import { sendInBackground } from '@/server/email/send';
import { toClientOrder } from '@/server/orders';
import { db } from '@/lib/db';
import { SITE_URL } from '@/lib/site';
import { initializePayment, verifyPayment } from '@/server/chapa';

export type PaymentState = 'paid' | 'pending' | 'failed' | 'unpaid' | 'not_found';

interface StartParams {
  number: string;
  total: number;
  fullName: string;
  phone: string;
  email: string;
}

const makeTxRef = (number: string) => `${number}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

/** Creates a fresh payment attempt for an order and returns the page to pay on. */
export async function startOnlinePayment({ number, total, fullName, phone, email }: StartParams): Promise<string> {
  const txRef = makeTxRef(number);
  // Saved first, so a payment that completes always matches an order
  await db.order.update({ where: { number }, data: { paymentRef: txRef } });

  const [firstName, ...rest] = fullName.trim().split(/\s+/);

  return initializePayment({
    txRef,
    amount: total,
    email,
    firstName: firstName || 'Customer',
    lastName: rest.join(' ') || 'Customer',
    phone,
    returnUrl: `${SITE_URL}/checkout/return?ref=${encodeURIComponent(number)}`,
    title: 'LUMIERE',
    description: `Order ${number}`,
  });
}

/**
 * Asks Chapa what really happened and updates the order. Safe to call many times
 * (the return page, the webhook and retries all use it).
 */
export async function confirmPayment(number: string): Promise<PaymentState> {
  const order = await db.order.findUnique({
    where: { number },
    select: { id: true, paymentMethod: true, paymentStatus: true, paymentRef: true, total: true },
  });

  if (!order) return 'not_found';
  if (order.paymentStatus === 'paid') return 'paid';
  if (order.paymentMethod !== 'chapa' || !order.paymentRef) return 'unpaid';

  const result = await verifyPayment(order.paymentRef, order.total);

  if (result.status === 'success') {
    // Never trust a "success" that does not match the order exactly
    if (result.currency !== 'ETB' || result.amount !== order.total || result.txRef !== order.paymentRef) {
      console.error('Payment mismatch', { number, expected: order.total, received: result });
      return 'failed';
    }
    // Move a pending order to "paid"; leave orders that already moved on (e.g. shipped) alone
    const moved = await db.order.updateMany({
      where: { id: order.id, paymentStatus: { not: 'paid' }, status: 'pending' },
      data: { paymentStatus: 'paid', status: 'paid' },
    });
    const flagged = await db.order.updateMany({
      where: { id: order.id, paymentStatus: { not: 'paid' } },
      data: { paymentStatus: 'paid' },
    });
    // Only the call that really flipped the order to "paid" sends the receipt
    if (moved.count + flagged.count > 0) {
      const full = await db.order.findUnique({ where: { id: order.id }, include: { items: true } });
      if (full) {
        const clientOrder = toClientOrder(full);
        sendInBackground(() => notifyPaymentReceived(clientOrder));
      }
    }
    return 'paid';
  }

  if (result.status === 'failed') {
    await db.order.updateMany({
      where: { id: order.id, paymentStatus: 'unpaid' },
      data: { paymentStatus: 'failed' },
    });
    return 'failed';
  }

  return 'pending';
}