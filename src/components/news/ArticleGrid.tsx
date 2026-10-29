'use client';

import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

const ARTICLES = [
  {
    id: 1,
    title: 'The Ultimate Guide to Hyaluronic Acid & Glass Skin',
    category: 'Skincare Tips',
    date: 'Oct 24, 2026',
    author: 'Dr. Elena Rostova',
    excerpt: 'Discover how to layer serums effectively for deep, long-lasting moisture and a radiant glow.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    title: 'Why Botanical Oils are Better for Sensitive Skin',
    category: 'Ingredients',
    date: 'Oct 18, 2026',
    author: 'Sophia Chen',
    excerpt: 'Cold-pressed plant extracts nourish skin barriers without triggering inflammation or clogging pores.',
    image: 'https://images.unsplash.com/photo-1608248597263-000799965d83?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    title: '5 Daily Habits for a Youthful Morning Glow',
    category: 'Self Care',
    date: 'Oct 10, 2026',
    author: 'Maya Lin',
    excerpt: 'Simple ritual swaps that reduce puffiness, boost collagen synthesis, and brighten your complexion.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
  },
];

export const ArticleGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {ARTICLES.map((article) => (
        <article
          key={article.id}
          className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              {article.category}
            </span>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                <span className="flex items-center gap-1"><Calendar size={12} /> {article.date}</span>
                <span className="flex items-center gap-1"><User size={12} /> {article.author}</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900 mb-2 hover:text-rose-600 transition-colors cursor-pointer">
                {article.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <button className="mt-6 flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer">
              Read Article <ArrowRight size={14} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};