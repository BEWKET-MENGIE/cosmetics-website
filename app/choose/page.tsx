// app/choose/page.tsx
import type { Metadata } from 'next';
import { ChooseHero } from '@/components/choose/ChooseHero';
import { ChooseBenefits } from '@/components/choose/ChooseBenefits';
import { ChooseCta } from '@/components/choose/ChooseCta';

export const metadata: Metadata = {
  title: 'Why Choose Us | LUMIÈRE',
  description: 'Organic, clinically tested, cruelty-free skincare and cosmetics.',
};

export default function ChoosePage() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ChooseHero />
        <ChooseBenefits />
        <ChooseCta />
      </div>
    </section>
  );
}