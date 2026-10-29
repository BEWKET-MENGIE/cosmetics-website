'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const [year, setYear] = useState<number | string>('2026');

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="space-y-4">
          <h3 className="text-2xl font-serif font-bold text-white tracking-wide">LUMIÈRE</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Elevating natural beauty through organic, eco-friendly luxury skincare and cosmetics.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop" className="hover:text-rose-400 transition-colors">Shop All</Link></li>
            <li><Link href="/category" className="hover:text-rose-400 transition-colors">Categories</Link></li>
            <li><Link href="/choose" className="hover:text-rose-400 transition-colors">Why Choose Us</Link></li>
            <li><Link href="/news" className="hover:text-rose-400 transition-colors">Journal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Customer Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-rose-400 transition-colors">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-rose-400 transition-colors">Returns & Exchanges</a></li>
            <li><a href="#" className="hover:text-rose-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-rose-400 transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        <div className="space-y-3 text-sm">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Get in Touch</h4>
          <p className="flex items-center gap-2"><Mail size={16} className="text-rose-400" /> support@lumiere.com</p>
          <p className="flex items-center gap-2"><Phone size={16} className="text-rose-400" /> +1 (800) 555-0199</p>
          <p className="flex items-center gap-2"><MapPin size={16} className="text-rose-400" /> New York, NY 10001</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© {year} LUMIÈRE Cosmetics. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Crafted with <Heart size={14} className="text-rose-500 fill-rose-500" /> for Luxury Beauty
        </p>
      </div>
    </footer>
  );
};