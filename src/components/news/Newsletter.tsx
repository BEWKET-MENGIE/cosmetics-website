// src/components/news/Newsletter.tsx
'use client';

import React, { useState } from 'react';
import { Check, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const PERKS = ['Up to 20% off coupons', 'Early access to new arrivals', 'No spam, unsubscribe anytime'];

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: send the email to your API / email service provider
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section aria-labelledby="newsletter-title" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-rose-500 via-rose-500 to-pink-600 px-6 py-12 text-center text-white shadow-2xl shadow-rose-200 sm:px-12 sm:py-16">
          {/* Decorative circles */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-12 h-64 w-64 rounded-full bg-amber-300/20 blur-2xl"
          />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
              <Mail size={26} aria-hidden="true" />
            </div>

            <h2 id="newsletter-title" className="font-serif text-3xl font-bold leading-snug sm:text-4xl">
              Subscribe for Special Offers
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
              Get new product updates, skincare tips from the Journal and discount coupons delivered
              straight to your inbox.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (submitted) setSubmitted(false);
                }}
                aria-label="Email address"
                placeholder="Enter your email address..."
                className="min-w-0 grow rounded-full bg-white px-5 py-3.5 text-sm text-slate-900 shadow-inner focus:outline-2 focus:outline-offset-2 focus:outline-white"
                required
              />
              <Button type="submit" variant="accent">
                Subscribe
              </Button>
            </form>

            <p role="status" className="mt-4 min-h-5 text-sm font-semibold">
              {submitted && 'Subscribed successfully! Thank you.'}
            </p>

            <ul className="mt-6 flex flex-col items-center justify-center gap-x-6 gap-y-2 text-xs text-white/85 sm:flex-row">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-center gap-1.5">
                  <Check size={14} aria-hidden="true" /> {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};