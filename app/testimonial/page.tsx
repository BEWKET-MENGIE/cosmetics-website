import React from 'react';
import { TestimonialHero, TestimonialGrid } from '@/components/testimonial';

export default function TestimonialPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TestimonialHero />
        <TestimonialGrid />
      </div>
    </main>
  );
}