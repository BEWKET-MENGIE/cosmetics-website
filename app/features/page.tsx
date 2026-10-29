import React from 'react';
import { FeaturedProducts } from '@/components/features/FeaturedProducts';
import { SkinQuiz } from '@/components/features/SkinQuiz';

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-white py-20 space-y-16">
      <FeaturedProducts />
      <SkinQuiz />
    </main>
  );
}