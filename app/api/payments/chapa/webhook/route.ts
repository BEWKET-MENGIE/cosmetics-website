// app/api/payments/chapa/webhook/route.ts
import { db } from '@/lib/db';
import { isValidWebhookSignature } from '@/server/chapa';
import { confirmPayment } from '@/server/payments';

/** Set this address as your webhook URL in the Chapa dashboard (it must be public, so after deploying). */
export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!isValidWebhookSignature(rawBody, request.headers)) {
    return new Response('Invalid signature', { status: 401 });
  }

  let txRef: string | undefined;
  try {
    const payload = JSON.parse(rawBody) as { tx_ref?: string; trx_ref?: string };
    txRef = payload.tx_ref ?? payload.trx_ref;
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  if (txRef) {
    const order = await db.order.findUnique({ where: { paymentRef: txRef }, select: { number: true } });
    if (order) {
      try {
        // Re-checks with Chapa itself. The webhook body is never trusted on its own.
        await confirmPayment(order.number);
      } catch (error) {
        console.error('Webhook verify failed', error);
        return new Response('Retry later', { status: 500 }); // Chapa will send it again
      }
    }
  }

  // 200 tells Chapa the event arrived, even for unknown references
  return new Response('ok', { status: 200 });
}