// src/components/Hero/HeroSection.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Leaf, Pause, Play, ShieldCheck, Star } from 'lucide-react';
import { HERO_MARQUEE, HERO_SLIDES } from '@/data/hero';
import { formatPrice } from '@/lib/format';
import { HeroMarquee } from './HeroMarquee';

const AUTOPLAY_MS = 6000;

// Make sure these claims are true for your brand before publishing.
const TRUST_BADGES = [
  { Icon: Leaf, label: '100% Vegan', color: 'text-emerald-300' },
  { Icon: ShieldCheck, label: 'Dermatologist Tested', color: 'text-rose-300' },
  { Icon: Star, label: '4.9/5 Rating', color: 'text-amber-300 fill-amber-300' },
];

export const HeroSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [userPaused, setUserPaused] = useState(false); // the pause button
  const [hovering, setHovering] = useState(false); // mouse is over the hero
  const [reducedMotion, setReducedMotion] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const slide = HERO_SLIDES[activeTab];
  const autoplay = !userPaused && !hovering && !reducedMotion;

  // Respect "reduce motion" system setting
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(query.matches);

    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  // Auto-advance. Depending on activeTab restarts the timer after a manual change.
  useEffect(() => {
    if (!autoplay) return;

    const id = window.setInterval(() => {
      setActiveTab((current) => (current + 1) % HERO_SLIDES.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [autoplay, activeTab]);

  // WAI-ARIA tabs pattern: arrow keys move between tabs
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const last = HERO_SLIDES.length - 1;
    let next = activeTab;

    if (e.key === 'ArrowRight') next = activeTab === last ? 0 : activeTab + 1;
    else if (e.key === 'ArrowLeft') next = activeTab === 0 ? last : activeTab - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;

    e.preventDefault();
    setActiveTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      // Only a real mouse pauses the slideshow (a tap on a phone must not freeze it)
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      className="relative isolate flex min-h-[640px] flex-col overflow-hidden bg-slate-950 text-white lg:min-h-[calc(100svh-5rem)]"
    >
      {/* Full-bleed background photos (cross-fade + slow zoom) */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {HERO_SLIDES.map((s, idx) => (
          <Image
            key={s.id}
            src={s.image}
            alt=""
            fill
            priority={idx === 0}
            sizes="100vw"
            style={{ objectPosition: s.imagePosition ?? 'center' }}
            className={`object-cover transition-all duration-1000 ease-out motion-reduce:transition-none ${
              idx === activeTab ? 'scale-105 opacity-100' : 'scale-100 opacity-0'
            }`}
          />
        ))}
        {/* Dark overlays keep the white text readable on any photo */}
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/85 via-slate-950/55 to-slate-950/10" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-slate-950/20" />
      </div>

      {/* Content */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="text-center lg:text-left">
            {/* Tabs + pause button */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:justify-start">
              <div
                role="tablist"
                aria-label="Hero collections"
                onKeyDown={handleKeyDown}
                className="inline-flex gap-1 rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-md"
              >
                {HERO_SLIDES.map((s, idx) => {
                  const selected = activeTab === idx;
                  return (
                    <button
                      key={s.id}
                      ref={(el) => {
                        tabRefs.current[idx] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`hero-tab-${s.id}`}
                      aria-selected={selected}
                      aria-controls="hero-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setActiveTab(idx)}
                      className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-5 ${
                        selected
                          ? 'bg-white text-slate-900 shadow-md'
                          : 'text-white/80 hover:bg-white/15 hover:text-white'
                      }`}
                    >
                      {s.tabName}
                    </button>
                  );
                })}
              </div>

              {!reducedMotion && (
                <button
                  type="button"
                  onClick={() => setUserPaused((paused) => !paused)}
                  aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {userPaused ? (
                    <Play size={14} aria-hidden="true" />
                  ) : (
                    <Pause size={14} aria-hidden="true" />
                  )}
                </button>
              )}
            </div>

            {/* Tab panel. `key` replays the fade-in on every change. */}
            <div
              key={slide.id}
              id="hero-panel"
              role="tabpanel"
              aria-labelledby={`hero-tab-${slide.id}`}
              aria-live={autoplay ? 'off' : 'polite'}
              className="animate-fade-up space-y-6 motion-reduce:animate-none"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-rose-100 backdrop-blur-md">
                <Leaf size={14} aria-hidden="true" /> {slide.badge}
              </span>

              <h1 className="font-serif text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-7xl">
                {slide.headingStart}{' '}
                <span className="italic text-rose-300">{slide.headingAccent}</span>
              </h1>

              <p className="mx-auto max-w-xl text-base leading-relaxed text-white/85 sm:text-lg lg:mx-0">
                {slide.description}
              </p>

              <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row lg:justify-start">
                <Link
                  href="/shop"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-rose-950/40 transition-all duration-300 hover:bg-rose-600 sm:w-auto"
                >
                  Explore Collection
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link
                  href="/choose"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/20 sm:w-auto"
                >
                  Why Lumière
                </Link>
              </div>

              <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-white/20 pt-6 text-xs text-white/80 lg:justify-start">
                {TRUST_BADGES.map(({ Icon, label, color }) => (
                  <li key={label} className="flex items-center gap-1.5">
                    <Icon size={16} className={color} aria-hidden="true" /> {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Featured product card (large screens only) */}
          <div className="hidden justify-end lg:flex">
            <Link
              key={slide.id}
              href="/shop"
              className="group flex w-full max-w-xs animate-fade-up items-center justify-between gap-4 rounded-2xl border border-white/25 bg-white/10 p-5 shadow-2xl backdrop-blur-md transition-colors hover:bg-white/20 motion-reduce:animate-none"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-rose-200">
                  Featured · Bestseller
                </p>
                <p className="mt-1 font-serif text-lg font-bold">{slide.featuredProduct}</p>
                <p className="text-sm font-semibold text-white/90">{formatPrice(slide.price)}</p>
              </div>
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-900 transition-colors group-hover:bg-rose-500 group-hover:text-white"
              >
                <ArrowUpRight size={18} />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Moving text strip */}
      <HeroMarquee items={HERO_MARQUEE} />
    </section>
  );
};