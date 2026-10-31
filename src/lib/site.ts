// src/lib/site.ts

export type SocialPlatform = 'instagram' | 'facebook' | 'x';

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

interface SiteConfig {
  name: string;
  tagline: string;
  /** Pill shown next to the logo. Set to '' to hide it. */
  badge: string;
  description: string;
  contact: {
    email: string;
    phone: string;
    phoneHref: string;
    address: string;
  };
  socials: SocialLink[];
}

export const SITE: SiteConfig = {
  name: 'LUMIÈRE', // change to 'Glowora' if you prefer the design's brand name
  tagline: 'Natural Skincare',
  badge: 'Recommended',
  description:
    'Elevating natural beauty through organic, eco-friendly luxury skincare and cosmetics.',
  contact: {
    email: 'support@lumiere.com',
    phone: '+1 (800) 555-0199',
    phoneHref: 'tel:+18005550199',
    address: 'New York, NY 10001',
  },
  // TODO: replace with your real profile addresses
  socials: [
    { platform: 'instagram', label: 'Instagram', href: 'https://instagram.com' },
    { platform: 'facebook', label: 'Facebook', href: 'https://facebook.com' },
    { platform: 'x', label: 'X (Twitter)', href: 'https://x.com' },
  ],
};

/** Your public web address. Set NEXT_PUBLIC_SITE_URL in .env.local once you have a domain. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';