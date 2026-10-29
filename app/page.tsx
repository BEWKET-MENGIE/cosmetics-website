import React from 'react';
import { HeroSection } from '@/components/Hero/HeroSection';
import { ShopCatalog } from '@/components/Shop/ShopCatalog';
import { FeaturedProducts } from '@/components/features/FeaturedProducts';
import { CategorySection } from '@/components/category/CategorySection';
import { SkinQuiz } from '@/components/features/SkinQuiz';
import { WhyChooseUs } from '@/components/choose/WhyChooseUs';
import { Testimonials } from '@/components/testimonial/Testimonials';
import { Newsletter } from '@/components/news/Newsletter';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <ShopCatalog />
      <FeaturedProducts />
      <CategorySection />
      <SkinQuiz />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </main>
  );
}