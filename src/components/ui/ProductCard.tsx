'use client';

import React, { useState } from 'react';
import { Star, ShoppingBag, Heart, Eye } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { ProductModal } from './ProductModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [liked, setLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();

  return (
    <>
      <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-rose-100/60 flex flex-col h-full">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.isBestSeller && (
            <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="bg-rose-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          aria-pressed={liked}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:text-rose-500 transition-colors shadow-sm cursor-pointer"
        >
          <Heart size={18} className={liked ? 'fill-rose-500 text-rose-500' : ''} />
        </button>

        {/* Image with Hover Quick-View Button */}
        <div className="relative h-64 w-full overflow-hidden bg-slate-100 cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Eye size={14} /> Quick View
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="p-5 flex-1">
          <span className="text-xs text-rose-500 font-semibold">{product.category}</span>
          <h3
            onClick={() => setIsModalOpen(true)}
            className="text-base font-bold text-slate-800 mt-1 line-clamp-1 group-hover:text-rose-600 transition-colors cursor-pointer"
          >
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-1 mt-3">
            <Star size={14} className="fill-amber-400 text-amber-400" aria-hidden="true" />
            <span className="text-sm font-semibold text-slate-700">{product.rating}</span>
            <span className="text-xs text-slate-500">({product.reviewsCount} reviews)</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div>
              <span className="text-xs text-slate-500 block">Price</span>
              <span className="text-lg font-extrabold text-slate-900">
                {product.price.toLocaleString('en-US')} ETB
              </span>
            </div>
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="flex items-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer"
            >
              <ShoppingBag size={16} aria-hidden="true" />
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Render Modal */}
      {isModalOpen && (
        <ProductModal product={product} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};