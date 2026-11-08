
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ShoppingBag, Star } from 'lucide-react';

import { FEATURED_HERO_ITEMS } from '@/data/hero';
import { formatPrice } from '@/lib/format';

export function HeroFeaturedSlider() {
  return (
    <section
      aria-labelledby="bestsellers-heading"
      className="relative overflow-hidden bg-[#F8F5F0] py-16 sm:py-20 lg:py-24"
    >
      {/* Decorative Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-rose-200/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-10 flex items-end justify-between gap-4 sm:mb-12">

          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-600 sm:text-sm">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-rose-500"
              />
              Handpicked Essentials
            </span>

            <h2
              id="bestsellers-heading"
              className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#18352B] sm:text-4xl lg:text-5xl"
            >
              Our Bestsellers
              <span className="block italic text-rose-500">
                Spotlight
              </span>
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-gray-600 sm:text-base">
              Discover our most-loved botanical skincare essentials,
              thoughtfully crafted to nourish your skin and reveal
              your natural radiance.
            </p>
          </div>

          {/* View All */}
          <Link
            href="/shop"
            className="group mb-1 hidden shrink-0 items-center gap-2 rounded-full border border-[#18352B]/20 px-5 py-3 text-sm font-semibold text-[#18352B] transition-all duration-300 hover:border-rose-500 hover:bg-rose-500 hover:text-white sm:inline-flex"
          >
            View All Products

            <ArrowUpRight
              size={17}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Products */}
        <ul
          tabIndex={0}
          aria-label="Bestselling skincare products"
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
        >
          {FEATURED_HERO_ITEMS.map((item) => (
            <li
              key={item.id}
              className="w-[85%] shrink-0 snap-start sm:w-auto"
            >
              <article className="group relative flex h-full items-center gap-4 rounded-2xl border border-[#18352B]/10 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-xl sm:gap-5 sm:p-5">

                {/* Product Image */}
                <Link
                  href="/shop"
                  aria-label={`View ${item.name}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F8F5F0] sm:h-28 sm:w-28"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 96px, 112px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>

                {/* Product Details */}
                <div className="min-w-0 flex-1">

                  <span className="mb-2 inline-block rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-600">
                    {item.category}
                  </span>

                  <h3 className="truncate font-serif text-base font-semibold text-[#18352B] sm:text-lg">
                    {item.name}
                  </h3>

                  {/* Price and Rating */}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-[#18352B] sm:text-base">
                      {formatPrice(item.price)}
                    </span>

                    <span
                      className="flex items-center gap-1 text-xs font-medium text-amber-500"
                      aria-label={`Rated ${item.rating.toFixed(1)} out of 5`}
                    >
                      <Star
                        size={13}
                        fill="currentColor"
                        aria-hidden="true"
                      />

                      {item.rating.toFixed(1)}
                    </span>
                  </div>

                  {/* Shop Button */}
                  <Link
                    href="/shop"
                    aria-label={`Shop ${item.name}`}
                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#18352B] transition-colors hover:text-rose-600 sm:text-sm"
                  >
                    Discover Product

                    <ArrowRight
                      size={14}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>

                {/* Quick Shop Icon */}
                <Link
                  href="/shop"
                  aria-label={`Shop ${item.name}`}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F5F0] text-[#18352B] transition-all duration-300 hover:bg-rose-500 hover:text-white"
                >
                  <ShoppingBag size={16} aria-hidden="true" />
                </Link>

              </article>
            </li>
          ))}
        </ul>

        {/* Mobile View All */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/shop"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#18352B] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-rose-500"
          >
            View All Products

            <ArrowRight
              size={17}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

      </div>
    </section>
  );
}
