// app/page.tsx
import { HeroSection } from '@/components/Hero/HeroSection';
import { HeroFeaturedSlider } from '@/components/Hero/HeroFeaturedSlider';
import { HeroStats } from '@/components/Hero/HeroStats';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HeroFeaturedSlider />
      <HeroStats />
    </>
  );
}