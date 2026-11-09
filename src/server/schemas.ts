// src/server/schemas.ts
import { z } from 'zod';
import { ETHIOPIAN_CITIES } from '@/lib/constants';

const PHONE_RE = /^(?:\+251|251|0)?[79]\d{8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (min: number, max: number, message: string) =>
  z.string().trim().min(min, message).max(max, 'This is too long.');

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, 'This is too long.')
  .regex(EMAIL_RE, 'Enter a valid email address.');

/** Turns "+251 911 234 567" or "911234567" into "0911234567". */
export function normalizePhone(value: string): string {
  const digits = value.replace(/[\s-]/g, '');
  if (digits.startsWith('+251')) return `0${digits.slice(4)}`;
  if (digits.startsWith('251')) return `0${digits.slice(3)}`;
  return digits.startsWith('0') ? digits : `0${digits}`;
}

export const orderSchema = z.object({
  customer: z.object({
    fullName: text(2, 100, 'Please enter your full name.'),
    phone: z
      .string()
      .trim()
      .refine((value) => PHONE_RE.test(value.replace(/[\s-]/g, '')), 'Enter a valid mobile number.'),
    email: z
      .string()
      .trim()
      .max(254, 'This is too long.')
      .refine((value) => value === '' || EMAIL_RE.test(value), 'Enter a valid email address.')
      .default(''),
  }),
  address: z.object({
    city: z.string().refine((city) => ETHIOPIAN_CITIES.includes(city), 'Please choose your city.'),
    details: text(5, 300, 'Please enter your delivery address.'),
    notes: z.string().trim().max(500, 'This is too long.').default(''),
  }),
  paymentMethod: z.enum(['cod', 'chapa']),
  // Only ids and quantities. Prices are never accepted from the browser.
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(64),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1, 'Your bag is empty.')
    .max(30, 'Too many different items in one order.'),
}).refine((data) => data.paymentMethod !== 'chapa' || data.customer.email !== '', {
  message: 'Email is required to pay online.',
  path: ['customer', 'email'],
});

export const newsletterSchema = z.object({
  email: emailSchema,
  /** Honeypot: real visitors never fill this in */
  website: z.string().optional(),
});

export const contactSchema = z.object({
  name: text(2, 100, 'Please enter your name.'),
  email: emailSchema,
  subject: text(2, 100, 'Please choose a subject.'),
  message: text(10, 2000, 'Please write at least 10 characters.'),
  /** Honeypot: real visitors never fill this in */
  website: z.string().optional(),
});