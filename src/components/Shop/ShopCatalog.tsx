'use client';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { FEATURED_PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/ui/ProductCard';

export const ShopCatalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const categories = ['All', 'Skincare', 'Lip Care', 'Eye & Face Makeup', 'Natural Oils'];

  const filteredProducts = useMemo(() => {
    return FEATURED_PRODUCTS.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 py-16 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
            <Sparkles size={14} /> Full Collection
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
            Explore Luxury Cosmetics
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Discover our complete range of organic skincare, nourishing lip treatments, and radiant makeup essentials.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-6 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-96">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-2 focus:outline-rose-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <SlidersHorizontal size={16} className="text-slate-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50/50 text-slate-700 focus:outline-2 focus:outline-rose-500 cursor-pointer"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/80">
            <p className="text-lg font-serif font-bold text-slate-800">No products found</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};