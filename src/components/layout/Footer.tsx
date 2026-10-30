// src/components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import { LEGAL_PAGES } from '@/data/legal';
import { SITE } from '@/lib/site';
import { CopyrightYear } from './CopyrightYear';
import { SocialLinks } from './SocialLinks';

const QUICK_LINKS = [
  { href: '/shop', label: 'Shop All' },
  { href: '/category', label: 'Categories' },
  { href: '/choose', label: 'Why Choose Us' },
  { href: '/news', label: 'Journal' },
  { href: '/testimonial', label: 'Reviews' },
];

const SUPPORT_LINKS = LEGAL_PAGES.map((page) => ({
  href: `/legal/${page.slug}`,
  label: page.title,
}));

const LINK_CLASS =
  'transition-colors hover:text-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400';
const HEADING_CLASS = 'mb-4 text-sm font-semibold uppercase tracking-wider text-white';

export const Footer: React.FC = () => {
  const { email, phone, phoneHref, address } = SITE.contact;

  return (
    // id="contact" is the target of the "Contact" link in the navbar
    <footer id="contact" className="border-t border-white/10 bg-neutral-950 pb-8 pt-16 text-neutral-300">
      <div className="mx-auto mb-12 grid max-w-7xl grid-cols-1 gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div className="space-y-5">
          <p className="font-serif text-2xl font-bold tracking-wide text-white">{SITE.name}</p>
          <p className="text-sm leading-relaxed text-neutral-400">{SITE.description}</p>
          <SocialLinks />
        </div>

        {/* Quick links */}
        <nav aria-label="Quick links">
          <h3 className={HEADING_CLASS}>Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={LINK_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Customer support */}
        <nav aria-label="Customer support">
          <h3 className={HEADING_CLASS}>Customer Support</h3>
          <ul className="space-y-2 text-sm">
            {SUPPORT_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={LINK_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h3 className={HEADING_CLASS}>Get in Touch</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-emerald-400" aria-hidden="true" />
              <a href={`mailto:${email}`} className={LINK_CLASS}>
                {email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-emerald-400" aria-hidden="true" />
              <a href={phoneHref} className={LINK_CLASS}>
                {phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="shrink-0 text-emerald-400" aria-hidden="true" />
              <span>{address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 px-4 pt-8 text-xs text-neutral-400 sm:flex-row sm:px-6 lg:px-8">
        <p>
          © <CopyrightYear /> {SITE.name} Cosmetics. All rights reserved.
        </p>
        <p className="flex items-center gap-1">
          Crafted with <Heart size={14} className="fill-rose-500 text-rose-500" aria-hidden="true" /> for
          Luxury Beauty
        </p>
      </div>
    </footer>
  );
};