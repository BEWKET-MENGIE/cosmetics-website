// src/data/choose.ts
import type { LucideIcon } from 'lucide-react';
import {
  Droplets,
  FlaskConical,
  Leaf,
  PackageCheck,
  Rabbit,
  ShieldCheck,
  Sprout,
} from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import { formatETB } from '@/lib/format';

// IMPORTANT: every claim below (organic, vegan, cruelty-free, testing, the 30-day guarantee,
// shipping times and the ingredient lists) must be true for your brand before you publish.
// Keep them in sync with src/data/legal.ts.

export interface ProofPoint {
  Icon: LucideIcon;
  title: string;
  text: string;
}

export const HERO_PROOF: ProofPoint[] = [
  { Icon: Leaf, title: 'Organic & Vegan', text: 'Plant-based formulas you can feel good about.' },
  { Icon: Rabbit, title: 'Cruelty-Free', text: 'Never tested on animals, ever.' },
  { Icon: ShieldCheck, title: '30-Day Guarantee', text: 'Love it or send it back.' },
];

export interface ProcessStep {
  Icon: LucideIcon;
  title: string;
  description: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    Icon: Sprout,
    title: 'Responsibly Sourced',
    description: 'We choose plant extracts from growers who farm with care for the land.',
  },
  {
    Icon: Droplets,
    title: 'Cold-Pressed',
    description: 'Gentle extraction keeps the natural nutrients intact, with no harsh solvents.',
  },
  {
    Icon: FlaskConical,
    title: 'Tested for Safety',
    description: 'Every batch is checked for quality and stability before it leaves us.',
  },
  {
    Icon: PackageCheck,
    title: 'Packed with Care',
    description: 'Recyclable glass and biodegradable cartons, shipped within 1 to 2 business days.',
  },
];

export const INGREDIENTS_IN: string[] = [
  'Cold-pressed botanical oils',
  'Plant-based humectants for lasting moisture',
  'Vitamin-rich natural extracts',
  'Recyclable glass and biodegradable packaging',
];

export const INGREDIENTS_OUT: string[] = [
  'Parabens',
  'Sulfates (SLS and SLES)',
  'Synthetic fragrances',
  'Mineral oil',
  'Animal-derived ingredients',
];

export interface Faq {
  question: string;
  answer: string;
  link?: { href: string; label: string };
}

export const FAQS: Faq[] = [
  {
    question: 'Are your products really organic and vegan?',
    answer:
      'Our formulas are plant-based and made without animal-derived ingredients. Check the ingredient list on each product for the full details.',
  },
  {
    question: 'Are they suitable for sensitive skin?',
    answer:
      'Many of our products are gentle and fragrance-free, but everyone\u2019s skin is different. We recommend a patch test on your inner arm before first use, and checking with a dermatologist if you have a skin condition.',
  },
  {
    question: 'How long does delivery take?',
    answer: `Orders ship within 1 to 2 business days and usually arrive in 2 to 5 business days. Orders over ${formatETB(FREE_SHIPPING_THRESHOLD)} ship free.`,
    link: { href: '/legal/shipping', label: 'Read the shipping policy' },
  },
  {
    question: 'What if I am not happy with my order?',
    answer:
      'You can return a product within 30 days of delivery for a refund or an exchange. Just email us with your order number.',
    link: { href: '/legal/returns', label: 'Read the returns policy' },
  },
  {
    question: 'How should I store my products?',
    answer:
      'Keep them in a cool, dry place away from direct sunlight, and close the lid tightly after use. Botanical formulas are best used within the period shown on the label.',
  },
];