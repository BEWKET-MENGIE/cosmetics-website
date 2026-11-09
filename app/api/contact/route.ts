// app/api/contact/route.ts
import { notifyContact } from '@/server/email/notify';
import { sendInBackground } from '@/server/email/send';
import { db } from '@/lib/db';
import { fieldErrors, getClientIp, json, readJson } from '@/server/http';
import { rateLimit } from '@/server/rateLimit';
import { contactSchema } from '@/server/schemas';

export async function POST(request: Request) {
  const limit = rateLimit(`contact:${getClientIp(request)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return json(
      { code: 'rate_limited', error: 'Too many messages. Please try again in a few minutes.' },
      429,
      { 'Retry-After': String(limit.retryAfter) },
    );
  }

  const parsed = contactSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return json(
      { code: 'validation', error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error) },
      400,
    );
  }

  // Honeypot filled in: pretend it worked, save nothing
  if (parsed.data.website) return json({ ok: true });

  const { name, email, subject, message } = parsed.data;

  try {
    await db.contactMessage.create({ data: { name, email, subject, message } });
    sendInBackground(() => notifyContact({ name, email, subject, message }));
    return json({ ok: true }, 201);
  } catch (error) {
    console.error('Contact failed', error);
    return json({ code: 'server', error: 'We could not send your message. Please try again.' }, 500);
  }
}