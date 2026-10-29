import React from 'react';
import { Sparkles, Leaf, HeartHandshake, RefreshCw } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';

interface Reason {
  Icon: LucideIcon;
  title: string;
  description: string;
}

// Note: These claims (laboratory testing, dermatologist approval, 30-day money-back guarantee) should be accurate
const REASONS: Reason[] = [
  {
    Icon: Leaf,
    title: '100% Natural Ingredients',
    description: 'Our products are entirely formulated from natural plant extracts and are gentle on your skin health.',
  },
  {
    Icon: Sparkles,
    title: 'Certified Quality',
    description: 'Each of our products is laboratory tested and approved by professional dermatologists.',
  },
  {
    Icon: HeartHandshake,
    title: 'Trusted Service',
    description: 'Prioritizing customer satisfaction, we always provide top-notch and prompt customer care.',
  },
  {
    Icon: RefreshCw,
    title: 'Money-Back Guarantee',
    description: 'If you are not satisfied with our products, we offer a full refund guarantee within 30 days.',
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-us" className="scroll-mt-20 py-20 bg-rose-50/50 border-y border-rose-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="About Us" title="Why Choose LUMIÈRE?" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {REASONS.map(({ Icon, title, description }) => (
            <div
              key={title}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Icon className="text-rose-500" size={32} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};