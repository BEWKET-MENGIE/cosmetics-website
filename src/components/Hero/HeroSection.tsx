import React from 'react';
import { Button } from '../ui/Button';
import { ArrowRight, Award, ShieldCheck, Truck } from 'lucide-react';

const BADGES = [
  { Icon: ShieldCheck, label: '100% Organic' },
  { Icon: Truck, label: 'Fast Delivery' },
  { Icon: Award, label: 'Certified Quality' },
];

export const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-b from-rose-50/60 via-white to-white py-16 lg:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-rose-100/80 text-rose-700 px-4 py-1.5 rounded-full text-xs font-semibold">
              <span aria-hidden="true">✨</span>
              <span>100% Natural Beauty Results</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 leading-snug">
              Enhance Your Natural Beauty
              <span className="block py-1 bg-gradient-to-r from-rose-600 via-pink-500 to-amber-600 bg-clip-text text-transparent">
                With Premium Quality
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover natural and scientifically formulated cosmetics designed for your skin. Fully safe and dermatologist tested.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button href="#products" variant="primary" className="gap-2 w-full sm:w-auto">
                Shop Now <ArrowRight size={18} aria-hidden="true" />
              </Button>
              <Button href="#categories" variant="outline" className="w-full sm:w-auto">
                Explore Products
              </Button>
            </div>

            {/* Badges */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-100">
              {BADGES.map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2 justify-center lg:justify-start">
                  <Icon className="text-rose-500 shrink-0" size={20} aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-medium text-slate-700">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-4 rounded-3xl bg-linear-to-r from-rose-300 to-amber-200 opacity-30 blur-2xl" aria-hidden="true" />
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800"
                alt="Natural cosmetics products display"
                fetchPriority="high"
                className="relative rounded-3xl shadow-2xl object-cover w-full h-[450px] lg:h-[520px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};