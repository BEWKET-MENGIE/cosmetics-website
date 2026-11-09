// src/components/common/LeftCategorySidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Flower2, Droplet, Heart, Layers } from 'lucide-react';

const categories = [
  { name: 'All Products', slug: 'all', icon: Layers },
  { name: 'Botanical Skincare', slug: 'botanical-skincare', icon: Flower2 },
  { name: 'Natural Beauty Oils', slug: 'natural-beauty-oils', icon: Droplet },
  { name: 'Radiance Serums', slug: 'radiance-serums', icon: Sparkles },
  { name: 'Best Sellers', slug: 'best-sellers', icon: Heart },
];

export function LeftCategorySidebar() {
  return (
    <aside aria-label="Categories" className="fixed left-0 top-1/2 -translate-y-1/2 z-40 group">
      {/* Container: Compact width (w-16) by default, expands to w-64 on hover */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl rounded-r-2xl py-4 px-2.5 w-16 group-hover:w-64 transition-all duration-300 ease-in-out overflow-hidden flex flex-col gap-3">
        
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 px-1 py-1 text-slate-800 font-semibold border-b border-slate-100 pb-3">
          <span className="w-9 h-9 flex items-center justify-center bg-slate-900 text-white rounded-xl shrink-0 shadow-md">
            <Layers className="w-4 h-4" />
          </span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-xs font-bold uppercase tracking-widest text-slate-700">
            Categories
          </span>
        </div>

        {/* Category Items List */}
        <nav className="flex flex-col gap-1.5">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors group/item whitespace-nowrap"
              >
                <span className="w-9 h-9 flex items-center justify-center bg-slate-50 group-hover/item:bg-white text-slate-600 rounded-xl shrink-0 shadow-sm border border-slate-100">
                  <IconComponent className="w-4 h-4 text-emerald-600" />
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}