'use client';

import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Leaf, Sparkles, Heart } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { Button } from './Button';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [liked, setLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shadow-sm"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Column */}
          <div className="relative h-72 md:h-full bg-slate-100 min-h-[320px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.isBestSeller && (
                <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Best Seller
                </span>
              )}
              {product.isNew && (
                <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  New Arrival
                </span>
              )}
            </div>
          </div>

          {/* Details Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                {product.category}
              </span>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-200'}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewsCount} verified reviews)</span>
              </div>

              {/* Price */}
              <p className="text-2xl font-extrabold text-slate-900 mt-4">
                {product.price.toLocaleString('en-US')} ETB
              </p>

              {/* Description */}
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed mt-3">
                {product.description}
              </p>

              {/* Key Highlights */}
              <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Leaf size={16} className="text-emerald-500 shrink-0" />
                  <span>100% Organic</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <ShieldCheck size={16} className="text-rose-500 shrink-0" />
                  <span>Dermatologist Tested</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Sparkles size={16} className="text-amber-500 shrink-0" />
                  <span>Cruelty-Free</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Heart size={16} className="text-rose-400 shrink-0" />
                  <span>For All Skin Types</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4">
                {/* Quantity Control */}
                <div className="flex items-center border border-slate-200 rounded-full bg-slate-50 px-3 py-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-slate-500 hover:text-slate-800 px-2 py-1 font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-bold text-slate-800">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-slate-500 hover:text-slate-800 px-2 py-1 font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => setLiked(!liked)}
                  className={`p-3 rounded-full border transition-colors cursor-pointer ${
                    liked
                      ? 'border-rose-500 bg-rose-50 text-rose-500'
                      : 'border-slate-200 text-slate-500 hover:text-rose-500'
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <Heart size={20} className={liked ? 'fill-rose-500' : ''} />
                </button>
              </div>

              <Button
                variant="primary"
                onClick={handleAddToCart}
                className="w-full gap-2 py-3.5 shadow-lg shadow-rose-200"
              >
                <ShoppingBag size={18} />
                Add to Shopping Bag
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};