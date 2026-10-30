// src/data/hero.ts

export interface HeroSlide {
  id: string;
  tabName: string;
  badge: string;
  headingStart: string;
  headingAccent: string;
  description: string;
  /** Wide landscape photo in /public, at least 1920px wide */
  image: string;
  /** CSS object-position: which part of the photo stays visible when it is cropped */
  imagePosition?: string;
  featuredProduct: string;
  price: number;
}

export interface HeroFeaturedItem {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'skincare',
    tabName: 'Botanical Skincare',
    badge: '100% Organic & Vegan',
    headingStart: 'Illuminate Your',
    headingAccent: 'Natural Radiance',
    description:
      'Experience skincare elixirs crafted with pure cold-pressed botanicals that nourish the skin barrier and restore natural elasticity.',
    image: '/images/hero/hero-banner.jpg',
    imagePosition: '70% center',
    featuredProduct: 'Rose Elixir Serum',
    price: 48,
  },
  {
    id: 'oils',
    tabName: 'Natural Beauty Oils',
    badge: 'Cold-Pressed Nutrients',
    headingStart: 'Deep Glow &',
    headingAccent: 'Barrier Defense',
    description:
      'Potent botanical oils designed to lock in deep hydration without clogging pores, leaving a velvety, glass-skin finish.',
    image: '/images/hero/hero-serum.jpg',
    imagePosition: '60% center',
    featuredProduct: 'Argan Radiance Oil',
    price: 52,
  },
];

// Text that scrolls along the bottom of the hero.
// Make sure every claim is true for your brand. Keep the shipping amount
// in sync with FREE_SHIPPING_THRESHOLD in src/lib/constants.ts.
export const HERO_MARQUEE: string[] = [
  '100% Organic & Vegan',
  'Cruelty-Free',
  'Free Shipping Over 5,000 ETB',
  'Dermatologist Tested',
  '30-Day Money-Back Guarantee',
  'New Arrivals Every Month',
];

export const FEATURED_HERO_ITEMS: HeroFeaturedItem[] = [
  {
    id: '1',
    name: 'Rose Elixir Facial Serum',
    category: 'Skincare',
    price: 48,
    rating: 4.9,
    image: '/images/shop/product-1.jpg',
  },
  {
    id: '2',
    name: 'Botanical Velvet Lip Butter',
    category: 'Lip Care',
    price: 24,
    rating: 4.8,
    image: '/images/shop/product-2.jpg',
  },
  {
    id: '3',
    name: 'Hydrating Radiance Cream',
    category: 'Skincare',
    price: 56,
    rating: 5,
    image: '/images/shop/product-3.jpg',
  },
];