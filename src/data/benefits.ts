// src/data/benefits.ts
import type { LucideIcon } from 'lucide-react';
import { Leaf, Award, Rabbit, ShieldCheck, Sparkles, Recycle } from 'lucide-react';

export interface Benefit {
  id: string;
  Icon: LucideIcon;
  title: string;
  description: string;
}

// IMPORTANT: make sure every claim below is true for your brand before publishing
// (organic/vegan, clinical testing, Leaping Bunny certification, 30-day guarantee).
// The first four are the ones shown in the compact <WhyChooseUs /> section.
export const BENEFITS: Benefit[] = [
  {
    id: 'organic',
    Icon: Leaf,
    title: '100% Organic & Vegan',
    description:
      'Sustainably sourced plant extracts free from parabens, sulfates, and synthetic fragrances.',
  },
  {
    id: 'tested',
    Icon: Award,
    title: 'Clinically Tested',
    description:
      'Formulated and validated by dermatologists for safety and efficacy on all skin types.',
  },
  {
    id: 'cruelty-free',
    Icon: Rabbit,
    title: 'Cruelty-Free Ethics',
    description:
      'Never tested on animals. Certified Leaping Bunny partner committed to ethical beauty.',
  },
  {
    id: 'guarantee',
    Icon: ShieldCheck,
    title: 'Satisfaction Guaranteed',
    description: 'Shop with confidence backed by our 30-day money-back guarantee policy.',
  },
  {
    id: 'radiance',
    Icon: Sparkles,
    title: 'Visible Radiance',
    description:
      'Advanced nutrient delivery systems that nourish the skin barrier and promote a natural glow.',
  },
  {
    id: 'eco',
    Icon: Recycle,
    title: 'Eco-Friendly Packaging',
    description:
      'Recyclable glass bottles and biodegradable cartons designed to protect our planet.',
  },
];