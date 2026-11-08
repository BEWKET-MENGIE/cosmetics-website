
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, FocusEvent } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  ArrowUpRight,
  Leaf,
  Pause,
  Play,
  ShieldCheck,
  Star,
  Sparkles,
} from 'lucide-react';

import { HERO_MARQUEE, HERO_SLIDES } from '@/data/hero';
import { formatPrice } from '@/lib/format';
import { HeroMarquee } from './HeroMarquee';

// ==========================================
// CONFIGURATION
// ==========================================

const AUTOPLAY_MS = 6000;

// Only publish claims that are verified for your products.
const TRUST_BADGES = [
  {
    Icon: Leaf,
    label: '100% Vegan',
    color: 'text-emerald-300',
  },
  {
    Icon: ShieldCheck,
    label: 'Dermatologist Tested',
    color: 'text-rose-300',
  },
  {
    Icon: Star,
    label: '4.9/5 Rating',
    color: 'text-amber-300',
  },
];

// ==========================================
// HERO SECTION
// ==========================================

export function HeroSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const slide = HERO_SLIDES[activeTab] ?? HERO_SLIDES[0];

  const autoplay =
    !userPaused &&
    !hovering &&
    !focusWithin &&
    !reducedMotion &&
    HERO_SLIDES.length > 1;

  // ==========================================
  // REDUCED MOTION ACCESSIBILITY
  // ==========================================

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    setReducedMotion(mediaQuery.matches);

    const handleMotionChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // ==========================================
  // AUTOMATIC SLIDESHOW
  // ==========================================

  useEffect(() => {
    if (!autoplay) return;

    const interval = window.setInterval(() => {
      setActiveTab((current) => {
        return (current + 1) % HERO_SLIDES.length;
      });
    }, AUTOPLAY_MS);

    return () => window.clearInterval(interval);
  }, [autoplay, activeTab]);

  // ==========================================
  // SLIDE NAVIGATION
  // ==========================================

  const changeSlide = useCallback((index: number) => {
    if (index < 0 || index >= HERO_SLIDES.length) return;

    setActiveTab(index);
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const lastIndex = HERO_SLIDES.length - 1;

    let nextIndex = activeTab;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = activeTab === lastIndex ? 0 : activeTab + 1;
        break;

      case 'ArrowLeft':
        nextIndex = activeTab === 0 ? lastIndex : activeTab - 1;
        break;

      case 'Home':
        nextIndex = 0;
        break;

      case 'End':
        nextIndex = lastIndex;
        break;

      default:
        return;
    }

    event.preventDefault();

    changeSlide(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  // ==========================================
  // FOCUS ACCESSIBILITY
  // ==========================================

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (
      !event.currentTarget.contains(
        event.relatedTarget as Node | null
      )
    ) {
      setFocusWithin(false);
    }
  };

  // Avoid rendering an invalid carousel when no slides exist.
  if (!slide) return null;

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <section
      aria-label="Lumière featured collections"
      aria-roledescription="carousel"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') {
          setHovering(true);
        }
      }}
      onPointerLeave={() => setHovering(false)}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={handleBlur}
      className="relative isolate flex min-h-[680px] flex-col overflow-hidden bg-[#10251D] text-white lg:min-h-[calc(100svh-5rem)]"
    >

      {/* ======================================
          BACKGROUND SLIDESHOW
      ====================================== */}

      <div
        className="absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        {HERO_SLIDES.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out motion-reduce:transition-none ${
              index === activeTab
                ? 'opacity-100'
                : 'opacity-0'
            }`}
          >
            <Image
              src={item.image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              style={{
                objectPosition: item.imagePosition ?? 'center',
              }}
              className={`object-cover transition-transform duration-[8000ms] ease-out motion-reduce:transform-none motion-reduce:transition-none ${
                index === activeTab
                  ? 'scale-105'
                  : 'scale-100'
              }`}
            />
          </div>
        ))}

        {/* Deep botanical overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071C15]/95 via-[#10251D]/75 to-[#10251D]/20" />

        {/* Bottom cinematic gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#071C15]/85 via-transparent to-[#071C15]/25" />

        {/* Soft rose ambient light */}
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-rose-400/10 blur-[120px]" />

        {/* Dark left-side readability layer */}
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#071C15]/40 to-transparent lg:w-3/4" />
      </div>

      {/* ======================================
          HERO CONTENT
      ====================================== */}

      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">

        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">

          {/* LEFT: HERO TEXT */}
          <div className="max-w-3xl text-center lg:text-left">

            {/* Collection Tabs */}
            <div className="mb-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">

              <div
                role="tablist"
                aria-label="Featured skincare collections"
                onKeyDown={handleKeyDown}
                className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1.5 shadow-xl backdrop-blur-xl"
              >
                {HERO_SLIDES.map((item, index) => {
                  const selected = activeTab === index;

                  return (
                    <button
                      key={item.id}
                      ref={(element) => {
                        tabRefs.current[index] = element;
                      }}
                      id={`hero-tab-${item.id}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="hero-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => changeSlide(index)}
                      className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-5 ${
                        selected
                          ? 'bg-[#F8F2E9] text-[#18352B] shadow-lg'
                          : 'text-white/80 hover:bg-white/15 hover:text-white'
                      }`}
                    >
                      {item.tabName}
                    </button>
                  );
                })}
              </div>

              {/* Slideshow Control */}
              {!reducedMotion && HERO_SLIDES.length > 1 && (
                <button
                  type="button"
                  onClick={() => setUserPaused((previous) => !previous)}
                  aria-label={
                    userPaused
                      ? 'Play slideshow'
                      : 'Pause slideshow'
                  }
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-xl transition-all duration-300 hover:border-rose-300 hover:bg-rose-500/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {userPaused ? (
                    <Play size={15} fill="currentColor" aria-hidden="true" />
                  ) : (
                    <Pause size={15} aria-hidden="true" />
                  )}
                </button>
              )}
            </div>

            {/* ======================================
                HERO TEXT PANEL
            ====================================== */}

            <div
              key={slide.id}
              id="hero-panel"
              role="tabpanel"
              aria-labelledby={`hero-tab-${slide.id}`}
              aria-live={autoplay ? 'off' : 'polite'}
              className="animate-fade-up space-y-6 motion-reduce:animate-none"
            >

              {/* Brand Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/30 bg-rose-300/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-100 shadow-lg backdrop-blur-xl sm:text-xs">
                <Leaf
                  size={15}
                  className="text-rose-300"
                  aria-hidden="true"
                />
                {slide.badge}
              </div>

              {/* Main Heading */}
              <h1 className="font-serif text-4xl font-bold leading-[1.12] tracking-tight text-[#FFFDF8] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.2rem]">
                {slide.headingStart}{' '}

                <span className="relative inline-block italic text-[#F48CA9]">
                  {slide.headingAccent}

                  <span
                    aria-hidden="true"
                    className="absolute -bottom-2 left-0 h-[3px] w-2/3 rounded-full bg-rose-300/80"
                  />
                </span>
              </h1>

              {/* Description */}
              <p className="mx-auto max-w-xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8 lg:mx-0 lg:text-lg">
                {slide.description}
              </p>

              {/* Call To Action */}
              <div className="flex flex-col items-center justify-center gap-4 pt-3 sm:flex-row lg:justify-start">

                <Link
                  href="/shop"
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#F34D78] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-rose-950/30 transition-all duration-300 hover:-translate-y-1 hover:bg-[#E93E6C] hover:shadow-2xl hover:shadow-rose-950/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto"
                >
                  Explore Collection

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>

                <Link
                  href="/choose"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-rose-300 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto"
                >
                  <Sparkles
                    size={16}
                    className="text-rose-300"
                    aria-hidden="true"
                  />

                  Why Lumière

                  <ArrowUpRight
                    size={15}
                    className="opacity-70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>

              {/* Trust Indicators */}
              <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-4 border-t border-white/20 pt-7 text-[11px] font-medium text-white/85 sm:gap-x-7 sm:text-xs lg:justify-start">

                {TRUST_BADGES.map(({ Icon, label, color }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2"
                  >
                    <Icon
                      size={16}
                      className={color}
                      aria-hidden="true"
                    />

                    {label}
                  </li>
                ))}
              </ul>

            </div>
          </div>

          {/* ======================================
              RIGHT: FEATURED PRODUCT CARD
          ====================================== */}

          <div className="hidden justify-end lg:flex">

            <Link
              key={slide.id}
              href="/shop"
              aria-label={`Discover ${slide.featuredProduct}`}
              className="group relative w-full max-w-[360px] overflow-hidden rounded-3xl border border-white/25 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-rose-200/60 hover:bg-white/15"
            >

              {/* Decorative background */}
              <div
                aria-hidden="true"
                className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-rose-300/15 blur-3xl transition-all duration-500 group-hover:bg-rose-300/30"
              />

              <div className="relative flex items-center justify-between gap-5">

                <div className="min-w-0">

                  <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-200">
                    <Sparkles size={13} aria-hidden="true" />
                    Featured Bestseller
                  </span>

                  <h2 className="mt-3 font-serif text-xl font-bold text-white">
                    {slide.featuredProduct}
                  </h2>

                  <p className="mt-2 text-base font-semibold text-white/90">
                    {formatPrice(slide.price)}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-rose-200 transition-colors group-hover:text-white">
                    Discover Product
                    <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F8F2E9] text-[#18352B] shadow-lg transition-all duration-300 group-hover:rotate-45 group-hover:bg-rose-500 group-hover:text-white"
                >
                  <ArrowUpRight size={21} />
                </span>

              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-rose-400 transition-all duration-500 group-hover:w-full" />

            </Link>
          </div>

        </div>
      </div>

      {/* ======================================
          BOTTOM MARQUEE
      ====================================== */}

      <HeroMarquee items={HERO_MARQUEE} />

    </section>
  );
}
