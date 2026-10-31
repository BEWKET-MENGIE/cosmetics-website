// app/page.tsx
import { HeroSection } from '@/components/Hero/HeroSection';
import { HeroFeaturedSlider } from '@/components/Hero/HeroFeaturedSlider';
import { HeroStats } from '@/components/Hero/HeroStats';
import { CategorySection } from '@/components/category/CategorySection';
import { WhyChooseUs } from '@/components/choose/WhyChooseUs';
import { Testimonials } from '@/components/testimonial/Testimonials';
import { Newsletter } from '@/components/news/Newsletter';

export default function HomePage() {
  // Remove any line you don't want on the home page
  return (
    <>
      <HeroSection />
      <HeroFeaturedSlider />
      <CategorySection limit={4} />
      <HeroStats />
      <WhyChooseUs showLink />
      <Testimonials />
      <Newsletter />
    </>
  );
}