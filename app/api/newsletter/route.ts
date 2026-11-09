// app/api/newsletter/route.ts
import { notifyWelcome } from '@/server/email/notify';
import { sendInBackground } from '@/server/email/send';
import { db } from '@/lib/db';
import { fieldErrors, getClientIp, json, readJson } from '@/server/http';
import { rateLimit } from '@/server/rateLimit';
import { newsletterSchema } from '@/server/schemas';

export async function POST(request: Request) {
  const limit = rateLimit(`newsletter:${getClientIp(request)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return json(
      { code: 'rate_limited', error: 'Too many requests. Please try again later.' },
      429,
      { 'Retry-After': String(limit.retryAfter) },
    );
  }

  const parsed = newsletterSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return json(
      { code: 'validation', error: 'Please check your email address.', fields: fieldErrors(parsed.error) },
      400,
    );
  }

  const { email } = parsed.data;

  try {
    const existing = await db.subscriber.findUnique({ where: { email } });
    if (existing?.isActive) return json({ ok: true, alreadySubscribed: true });
    
    await db.subscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email },
    });

    // New (or returning) subscriber: send the welcome email with the unsubscribe link
    sendInBackground(() => notifyWelcome(email));
    
    return json({ ok: true }, 201);
  } catch (error) {
    console.error('Newsletter failed', error);
    return json({ code: 'server', error: 'We could not subscribe you. Please try again.' }, 500);
  }
}