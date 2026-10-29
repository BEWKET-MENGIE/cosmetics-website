'use client';

import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';

export const CartDrawer: React.FC = () => {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, subtotal } = useCart();

  // Free shipping threshold example (e.g., 5000 ETB)
  const freeShippingThreshold = 5000;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-rose-500" size={22} />
              <h2 className="text-lg font-serif font-bold text-slate-900">Your Shopping Bag</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-rose-50 px-6 py-3 border-b border-rose-100">
            <p className="text-xs text-rose-700 font-medium mb-1.5">
              {remainingForFreeShipping > 0
                ? `Add ${remainingForFreeShipping.toLocaleString('en-US')} ETB more for Free Shipping!`
                : '🎉 You have unlocked Free Shipping!'}
            </p>
            <div className="w-full bg-rose-200/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag size={28} />
                </div>
                <p className="text-slate-600 font-medium">Your shopping bag is empty.</p>
                <Button
                  variant="primary"
                  onClick={() => setIsOpen(false)}
                  className="mx-auto text-xs py-2 px-4"
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 items-center p-3 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl shrink-0 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{item.name}</h3>
                    <p className="text-xs text-rose-600 font-semibold mt-0.5">
                      {item.price.toLocaleString('en-US')} ETB
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 rounded-l-lg transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 rounded-r-lg transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-slate-100 px-6 py-6 bg-slate-50/50 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="text-lg font-bold text-slate-900">
                  {subtotal.toLocaleString('en-US')} ETB
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Shipping and taxes calculated at checkout.
              </p>
              <Button
                variant="primary"
                className="w-full flex items-center justify-center gap-2 py-3.5 shadow-lg shadow-rose-200"
                onClick={() => {
                  alert('Proceeding to checkout simulation!');
                }}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};