import React from 'react';
import { CATEGORIES } from '@/data/products';
import type { Category } from '@/types';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const CategorySection: React.FC = () => {
  return (
    <section id="categories" className="scroll-mt-20 py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Categories" title="Shop by Category" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category: Category) => (
            <a
              key={category.id}
              href="#products"
              className="group relative block h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            >
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs text-rose-200 font-medium">{category.itemCount}+ Products</span>
                <h3 className="text-xl font-bold mt-1 group-hover:text-rose-200 transition-colors">
                  {category.name}
                </h3>
                <div className="flex items-center gap-2 text-xs font-semibold mt-3 text-rose-300 transition-all duration-300 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0">
                  <span>View More</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};