'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Mail } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section id="newsletter" className="scroll-mt-20 py-16 bg-linear-to-r from-rose-500 to-pink-600 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
          <Mail size={24} className="text-white" aria-hidden="true" />
        </div>
        <h2 className="text-3xl font-serif font-bold leading-snug">Subscribe for Special Offers</h2>
        <p className="mt-2 text-white/90 text-sm max-w-xl mx-auto leading-relaxed">
          Subscribe to our newsletter to receive new product updates and up to 20% discount coupons directly in your inbox.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (submitted) setSubmitted(false);
            }}
            aria-label="Email Address"
            placeholder="Enter your email address..."
            className="px-5 py-3.5 rounded-full text-slate-900 bg-white focus:outline-2 focus:outline-offset-2 focus:outline-white grow min-w-0 text-sm shadow-inner"
            required
          />
          <Button type="submit" variant="accent">
            Subscribe
          </Button>
        </form>

        <p role="status" className="mt-4 text-sm font-medium min-h-5">
          {submitted && 'Subscribed successfully! Thank you.'}
        </p>
      </div>
    </section>
  );
};