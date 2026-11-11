// src/server/adminSchemas.ts
import { z } from 'zod';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_RE = /^(\/[^\s]*|https:\/\/[^\s]+)$/;

export const productSchema = z.object({
  name: z.string().trim().min(2, 'Enter a product name.').max(120, 'This is too long.'),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(140, 'This is too long.')
    .refine((value) => value === '' || SLUG_RE.test(value), 'Use lowercase letters, numbers and hyphens only.')
    .default(''),
  categoryId: z.string().min(1, 'Choose a category.'),
  description: z.string().trim().min(10, 'Write at least 10 characters.').max(1000, 'This is too long.'),
  image: z
    .string()
    .trim()
    .max(300, 'This is too long.')
    .regex(IMAGE_RE, 'Use a path like /images/shop/product-1.jpg or an https link.'),
  price: z.number('Enter a price.').int('Use a whole number.').min(1, 'Enter a price.').max(10_000_000, 'This is too high.'),
  stock: z.number('Enter the stock.').int('Use a whole number.').min(0, 'Stock cannot be negative.').max(100_000, 'This is too high.'),
  isNew: z.boolean(),
  isBestSeller: z.boolean(),
  featured: z.boolean(),
  isActive: z.boolean(),
});

export const productToggleSchema = z.object({ isActive: z.boolean() });

export const orderActionSchema = z.object({
  action: z.enum(['mark_paid', 'ship', 'deliver', 'cancel']),
});

export const messageStatusSchema = z.object({
  status: z.enum(['new', 'replied', 'closed']),
});
const blockSchema = z.object({
  type: z.enum(['heading', 'paragraph', 'quote']),
  text: z.string().trim().min(1, 'Write some text.').max(3000, 'This is too long.'),
});

export const articleSchema = z.object({
  title: z.string().trim().min(3, 'Enter a title.').max(160, 'This is too long.'),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(180, 'This is too long.')
    .refine((value) => value === '' || SLUG_RE.test(value), 'Use lowercase letters, numbers and hyphens only.')
    .default(''),
  category: z.string().trim().min(2, 'Enter a category.').max(60, 'This is too long.'),
  excerpt: z.string().trim().min(10, 'Write at least 10 characters.').max(300, 'Keep it under 300 characters.'),
  image: z
    .string()
    .trim()
    .max(300, 'This is too long.')
    .regex(IMAGE_RE, 'Use a path like /images/journal/article-1.jpg or an https link.'),
  imageAlt: z.string().trim().min(3, 'Describe the image.').max(200, 'This is too long.'),
  authorName: z.string().trim().min(2, 'Enter the author.').max(80, 'This is too long.'),
  authorRole: z.string().trim().min(2, 'Enter the author role.').max(80, 'This is too long.'),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date.'),
  featured: z.boolean(),
  isPublished: z.boolean(),
  body: z.array(blockSchema).min(1, 'Add at least one block.').max(60, 'Too many blocks.'),
});

export const articleToggleSchema = z.object({ isPublished: z.boolean() });

export const testimonialSchema = z.object({
  name: z.string().trim().min(2, 'Enter a name.').max(80, 'This is too long.'),
  role: z.string().trim().min(2, 'Enter a role.').max(80, 'This is too long.'),
  comment: z.string().trim().min(10, 'Write at least 10 characters.').max(600, 'Keep it under 600 characters.'),
  rating: z.number('Choose a rating.').int('Choose a rating.').min(1, 'Choose a rating.').max(5, 'Choose a rating.'),
  avatar: z
    .string()
    .trim()
    .max(300, 'This is too long.')
    .refine((value) => value === '' || IMAGE_RE.test(value), 'Use a path like /images/avatars/avatar-1.jpg, or leave it empty.')
    .default(''),
  isPublished: z.boolean(),
});

export const testimonialToggleSchema = z.object({ isPublished: z.boolean() });

/** "2026-11-12" to a safe date (noon UTC, so no time zone can move it to another day). */
export function parsePublishedDate(value: string): Date | null {
  const date = new Date(`${value}T12:00:00.000Z`);
  return Number.isNaN(date.getTime()) || !date.toISOString().startsWith(value) ? null : date;
}