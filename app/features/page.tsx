// app/features/page.tsx
import type { Metadata } from 'next';
import { FeaturedProducts } from '@/components/features/FeaturedProducts';

export const metadata: Metadata = { title: 'Featured Products | LUMIÈRE' };


export default function FeaturesPage() {
  return <FeaturedProducts />;
}