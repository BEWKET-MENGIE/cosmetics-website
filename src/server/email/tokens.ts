// src/server/email/tokens.ts
import { createHmac, timingSafeEqual } from 'node:crypto';
import { SITE_URL } from '@/lib/site';

function secret(): string {
  const value = process.env.BETTER_AUTH_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === 'production') throw new Error('BETTER_AUTH_SECRET is not set');
  return 'development-only-secret';
}

const sign = (email: string) =>
  createHmac('sha256', secret()).update(`unsubscribe:${email.trim().toLowerCase()}`).digest('hex');

export function unsubscribeUrl(email: string): string {
  const normalized = email.trim().toLowerCase();
  return `${SITE_URL}/unsubscribe?email=${encodeURIComponent(normalized)}&token=${sign(normalized)}`;
}

export function isValidUnsubscribeToken(email: string, token: string): boolean {
  const expected = Buffer.from(sign(email));
  const received = Buffer.from(token);
  return expected.length === received.length && timingSafeEqual(expected, received);
}