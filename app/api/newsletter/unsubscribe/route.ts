// app/api/newsletter/unsubscribe/route.ts
import { z } from 'zod';
import { db } from '@/lib/db';
import { isValidUnsubscribeToken } from '@/server/email/tokens';
import { getClientIp, json, readJson } from '@/server/http';
import { rateLimit } from '@/server/rateLimit';

const schema = z.object({
  email: z.string().trim().toLowerCase().max(254),
  token: z.string().min(10).max(200),
});

export async function POST(request: Request) {
  const limit = rateLimit(`unsubscribe:${getClientIp(request)}`, 10, 10 * 60 * 1000);
  if (!limit.ok) {
    return json({ code: 'rate_limited', error: 'Too many attempts. Please try again later.' }, 429, {
      'Retry-After': String(limit.retryAfter),
    });
  }

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success || !isValidUnsubscribeToken(parsed.data.email, parsed.data.token)) {
    return json({ code: 'invalid', error: 'This unsubscribe link is not valid.' }, 400);
  }

  await db.subscriber.updateMany({ where: { email: parsed.data.email }, data: { isActive: false } });
  return json({ ok: true });
}