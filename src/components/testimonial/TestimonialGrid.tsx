'use client';

import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Samantha W.',
    role: 'Verified Buyer',
    rating: 5,
    comment: 'The Hyaluronic Acid serum completely changed my skin texture within a week. My face feels deeply hydrated without any greasy residue!',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 2,
    name: 'Jessica M.',
    role: 'Skincare Blogger',
    rating: 5,
    comment: 'I am extremely picky about organic lip balms, but the Tinted Butter Balm is absolute perfection. Beautiful natural color and long-lasting moisture.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 3,
    name: 'Dr. Rachel Vance',
    role: 'Dermatologist',
    rating: 5,
    comment: 'I frequently recommend Lumière products to my patients with sensitive skin. The clean formulations and plant extracts are top-tier.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 4,
    name: 'Chloe K.',
    role: 'Verified Buyer',
    rating: 5,
    comment: 'The packaging is so luxurious and eco-friendly, and the botanical facial oil gives me the ultimate morning glass-skin glow!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  },
];

export const TestimonialGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      {REVIEWS.map((review) => (
        <div
          key={review.id}
          className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-1 text-amber-400 mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic mb-6">
              "{review.comment}"
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
            <img
              src={review.image}
              alt={review.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                {review.name}
                <CheckCircle size={14} className="text-emerald-500" />
              </h4>
              <p className="text-xs text-slate-400">{review.role}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};