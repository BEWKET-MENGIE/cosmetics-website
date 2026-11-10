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