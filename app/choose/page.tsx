// app/choose/page.tsx
import type { Metadata } from 'next';
import { ChooseHero } from '@/components/choose/ChooseHero';
import { ChooseBenefits } from '@/components/choose/ChooseBenefits';
import { ChooseProcess } from '@/components/choose/ChooseProcess';
import { ChooseIngredients } from '@/components/choose/ChooseIngredients';
import { ChooseFaq } from '@/components/choose/ChooseFaq';
import { ChooseCta } from '@/components/choose/ChooseCta';

export const metadata: Metadata = {
  title: 'Why Choose Us | LUMIÈRE',
  description:
    'Organic, cruelty-free skincare and cosmetics. See how we source, make and test every product.',
};

export default function ChoosePage() {
  return (
    <>
      <ChooseHero />
      <ChooseBenefits />
      <ChooseProcess />
      <ChooseIngredients />
      <ChooseFaq />
      <ChooseCta />
    </>
  );
}