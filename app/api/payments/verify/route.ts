// app/api/payments/verify/route.ts
import { z } from 'zod';
import { getClientIp, json, readJson } from '@/server/http';
import { confirmPayment } from '@/server/payments';
import { rateLimit } from '@/server/rateLimit';

const schema = z.object({ number: z.string().trim().min(1).max(64) });

export async function POST(request: Request) {
  const limit = rateLimit(`verify:${getClientIp(request)}`, 60, 10 * 60 * 1000);
  if (!limit.ok) {
    return json({ code: 'rate_limited', error: 'Too many requests. Please wait a moment.' }, 429, {
      'Retry-After': String(limit.retryAfter),
    });
  }

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return json({ code: 'validation', error: 'Missing order number.' }, 400);

  try {
    const state = await confirmPayment(parsed.data.number);
    if (state === 'not_found') return json({ code: 'not_found', error: 'Order not found.' }, 404);
    // Only a status goes back. No personal details leave this endpoint.
    return json({ state });
  } catch (error) {
    console.error('Payment verify failed', error);
    return json({ code: 'server', error: 'We could not check the payment right now.' }, 502);
  }
}