'use client';

import React from 'react';
import { Leaf, Award, HeartHandshake, Sparkles, RefreshCw, Lock } from 'lucide-react';

const BENEFITS = [
  {
    icon: Leaf,
    title: '100% Organic & Vegan',
    description: 'Sustainably sourced plant extracts free from parabens, sulfates, and synthetic fragrances.',
  },
  {
    icon: Award,
    title: 'Clinically Tested',
    description: 'Formulated and validated by top dermatologists for maximum safety and efficacy on all skin types.',
  },
  {
    icon: HeartHandshake,
    title: 'Cruelty-Free Ethics',
    description: 'Never tested on animals. Certified Leaping Bunny partner committed to ethical beauty.',
  },
  {
    icon: Sparkles,
    title: 'Visible Radiance',
    description: 'Advanced nutrient delivery systems that nourish skin barriers and promote a natural glow.',
  },
  {
    icon: RefreshCw,
    title: 'Eco-Friendly Packaging',
    description: 'Recyclable glass bottles and biodegradable cartons designed to protect our planet.',
  },
  {
    icon: Lock,
    title: 'Satisfaction Guaranteed',
    description: 'Shop with confidence backed by our 30-day money-back guarantee policy.',
  },
];

export const ChooseBenefits: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      {BENEFITS.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div
            key={index}
            className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
              <IconComponent size={24} />
            </div>
            <h3 className="font-serif font-bold text-xl text-slate-900 mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};