import React from 'react';
import { FEATURED_PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/ui/ProductCard';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const FeaturedProducts: React.FC = () => {
  return (
    <section id="products" className="scroll-mt-20 py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Featured Products"
          title="Beauty Essentials Loved by Our Customers"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};