// app/api/reviews/route.ts
import { z } from 'zod';
import { db } from '@/lib/db';
import { fieldErrors, getClientIp, json, readJson } from '@/server/http';
import { rateLimit } from '@/server/rateLimit';

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(80, 'This is too long.'),
  rating: z.number('Please choose a rating.').int('Please choose a rating.').min(1, 'Please choose a rating.').max(5, 'Please choose a rating.'),
  comment: z.string().trim().min(10, 'Please write at least 10 characters.').max(600, 'Please keep it under 600 characters.'),
  /** Honeypot: real visitors never fill this in */
  website: z.string().optional(),
});

export async function POST(request: Request) {
  const limit = rateLimit(`reviews:${getClientIp(request)}`, 3, 60 * 60 * 1000);
  if (!limit.ok) {
    return json({ code: 'rate_limited', error: 'Too many reviews from this connection. Please try again later.' }, 429, {
      'Retry-After': String(limit.retryAfter),
    });
  }

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) {
    return json(
      { code: 'validation', error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error) },
      400,
    );
  }

  // Honeypot filled in: pretend it worked, save nothing
  if (parsed.data.website) return json({ ok: true });

  try {
    // Saved hidden. It only appears on the site after you approve it in the admin.
    await db.testimonial.create({
      data: {
        name: parsed.data.name,
        role: 'Customer',
        comment: parsed.data.comment,
        rating: parsed.data.rating,
        avatar: '',
        isPublished: false,
      },
    });
    return json({ ok: true }, 201);
  } catch (error) {
    console.error('Review failed', error);
    return json({ code: 'server', error: 'We could not save your review. Please try again.' }, 500);
  }
}