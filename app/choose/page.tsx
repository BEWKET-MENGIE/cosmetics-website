import React from 'react';
import { ChooseHero, ChooseBenefits } from '@/components/choose';

export default function ChoosePage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ChooseHero />
        <ChooseBenefits />
      </div>
    </main>
  );
}