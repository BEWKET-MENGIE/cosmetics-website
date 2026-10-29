'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-serif font-bold text-xl shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
              L
            </span>
            <div className="flex flex-col">
              <span className="font-serif font-extrabold text-xl tracking-wider text-slate-900 group-hover:text-rose-600 transition-colors">
                LUMIÈRE
              </span>
              <span className="text-[10px] tracking-widest uppercase text-rose-500 font-bold -mt-1">
                Luxury Cosmetics
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-700 hover:text-rose-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-sm font-semibold text-slate-700 hover:text-rose-600 transition-colors flex items-center gap-1"
            >
              Shop
              <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                New
              </span>
            </Link>
            <a
              href="/#categories"
              className="text-sm font-semibold text-slate-700 hover:text-rose-600 transition-colors"
            >
              Categories
            </a>
            <a
              href="/#quiz"
              className="text-sm font-semibold text-slate-700 hover:text-rose-600 transition-colors flex items-center gap-1"
            >
              Routine Quiz
              <Sparkles size={13} className="text-amber-500" />
            </a>
            <a
              href="/#testimonials"
              className="text-sm font-semibold text-slate-700 hover:text-rose-600 transition-colors"
            >
              Reviews
            </a>
          </nav>

          {/* Right Actions (Shopping Bag Button + Mobile Toggle) */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleCart}
              className="relative p-2.5 rounded-full text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-800 hover:bg-rose-50 hover:text-rose-600"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-800 hover:bg-rose-50 hover:text-rose-600"
          >
            Shop Catalog
          </Link>
          <a
            href="/#categories"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-800 hover:bg-rose-50 hover:text-rose-600"
          >
            Categories
          </a>
          <a
            href="/#quiz"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-800 hover:bg-rose-50 hover:text-rose-600"
          >
            Routine Quiz
          </a>
          <a
            href="/#testimonials"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-800 hover:bg-rose-50 hover:text-rose-600"
          >
            Reviews
          </a>
        </div>
      )}
    </header>
  );
};