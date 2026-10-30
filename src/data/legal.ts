// src/data/legal.ts
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import { formatETB } from '@/lib/format';

export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalPage {
  slug: string;
  title: string;
  /** ISO date: YYYY-MM-DD */
  updated: string;
  intro: string;
  sections: LegalSection[];
}

// IMPORTANT: this is SAMPLE text so the footer links work. Replace every number and rule
// with your real policies, and have a lawyer review the Privacy Policy and Terms before launch.
export const LEGAL_PAGES: LegalPage[] = [
  {
    slug: 'shipping',
    title: 'Shipping Policy',
    updated: '2026-10-30',
    intro: 'How and when your LUMIÈRE order reaches you.',
    sections: [
      {
        heading: 'Processing time',
        body: [
          'Orders are packed and handed to the courier within 1 to 2 business days after payment is confirmed.',
        ],
      },
      {
        heading: 'Delivery',
        body: [
          'Delivery usually takes 2 to 5 business days depending on your location. You will receive tracking details by email once your order ships.',
        ],
      },
      {
        heading: 'Free shipping',
        body: [
          `Orders over ${formatETB(FREE_SHIPPING_THRESHOLD)} ship free. Shipping costs for smaller orders are shown at checkout.`,
        ],
      },
      {
        heading: 'Delayed, damaged or missing parcels',
        body: ['Contact us with your order number and we will make it right.'],
      },
    ],
  },
  {
    slug: 'returns',
    title: 'Returns & Exchanges',
    updated: '2026-10-30',
    intro: 'Not completely happy with your order? Here is how returns work.',
    sections: [
      {
        heading: '30-day money-back guarantee',
        body: [
          'If you are not satisfied with a product, you can return it within 30 days of delivery for a refund or an exchange.',
        ],
      },
      {
        heading: 'Condition of returned items',
        body: [
          'Please return items in their original packaging where possible. Opened products are reviewed case by case.',
        ],
      },
      {
        heading: 'How to start a return',
        body: [
          'Email us with your order number. We reply within 2 business days with step-by-step instructions.',
        ],
      },
      {
        heading: 'Refunds',
        body: [
          'Refunds are sent to your original payment method within 7 to 10 business days after we receive the return.',
        ],
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    updated: '2026-10-30',
    intro: 'What we collect, why we collect it and the choices you have.',
    sections: [
      {
        heading: 'Information we collect',
        body: [
          'We collect the details you give us when you order or subscribe: your name, email address, delivery address and order history.',
        ],
      },
      {
        heading: 'How we use it',
        body: [
          'We use your information to process orders, send updates you have asked for and improve our website. We do not sell your personal information.',
        ],
      },
      {
        heading: 'Who we share it with',
        body: [
          'We share only what is needed with trusted service providers such as couriers and payment processors, so they can complete your order.',
        ],
      },
      {
        heading: 'Cookies and local storage',
        body: [
          'We store your shopping bag in your browser so it is still there when you come back. You can clear it at any time in your browser settings.',
        ],
      },
      {
        heading: 'Your choices',
        body: [
          'You can unsubscribe from emails at any time, and you can ask us to access, correct or delete your data by contacting us.',
        ],
      },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    updated: '2026-10-30',
    intro: 'The rules for using our website and buying our products.',
    sections: [
      {
        heading: 'Using this website',
        body: [
          'By using this website you agree to these terms. Please do not use the site for anything unlawful.',
        ],
      },
      {
        heading: 'Products and pricing',
        body: [
          'We try to describe our products accurately, but prices, descriptions and availability can change without notice.',
        ],
      },
      {
        heading: 'Orders',
        body: [
          'Placing an order is an offer to buy. We may decline or cancel an order, for example if a product is unavailable, and we will refund you in full if that happens.',
        ],
      },
      {
        heading: 'Skin sensitivity',
        body: [
          'Everyone\u2019s skin is different. Please read the ingredients and patch test new products before regular use.',
        ],
      },
      {
        heading: 'Changes to these terms',
        body: ['We may update these terms from time to time. The date at the top shows the latest version.'],
      },
    ],
  },
];

export function getLegalPage(slug: string): LegalPage | undefined {
  return LEGAL_PAGES.find((page) => page.slug === slug);
}