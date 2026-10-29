import React from 'react';
import { CategoryHero, CategoryGrid } from '@/components/category';

export default function CategoryPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CategoryHero />
        <CategoryGrid />
      </div>
    </main>
  );
}