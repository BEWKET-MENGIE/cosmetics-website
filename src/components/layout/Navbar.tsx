// src/components/layout/Navbar.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Heart, Leaf, Search, ShoppingBag, User, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { SITE } from '@/lib/site';

const SHOP_MENU = [
  { href: '/shop', label: 'Shop All' },
  { href: '/category', label: 'Categories' },
  { href: '/features', label: 'Featured Products' },
];

const LINK_BASE =
  'text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400';

const ICON_BUTTON =
  'relative flex cursor-pointer items-center gap-2 rounded-full p-2 text-sm text-neutral-100 transition-colors hover:text-emerald-400 focus-visible:outline-2 focus-visible:outline-emerald-400';

const COUNT_BADGE =
  'absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-neutral-950';

interface NavLinkItemProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLinkItem: React.FC<NavLinkItemProps> = ({ href, active, children }) => (
  <Link
    href={href}
    aria-current={active ? 'page' : undefined}
    className={`${LINK_BASE} ${active ? 'text-emerald-400' : 'text-white hover:text-emerald-400'}`}
  >
    {children}
  </Link>
);

const formatCount = (count: number) => (count > 99 ? '99+' : count);

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, toggleCart } = useCart();
  const { count: wishlistCount } = useWishlist();

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const shopRef = useRef<HTMLDivElement>(null);
  const shopToggleRef = useRef<HTMLButtonElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close the dropdown and search panel whenever the page changes
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsShopOpen(false);
    setIsSearchOpen(false);
  }

  // "/news" is active on "/news/some-article", but "/shop" is not active on "/shopping"
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
  const shopActive = SHOP_MENU.some((item) => isActive(item.href));

  // Shop dropdown: close on outside click; Escape closes it and returns focus to the chevron
  useEffect(() => {
    if (!isShopOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!shopRef.current?.contains(e.target as Node)) setIsShopOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsShopOpen(false);
        shopToggleRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isShopOpen]);

  // Search panel: focus the input when opened; Escape closes it and returns focus to the button
  useEffect(() => {
    if (!isSearchOpen) return;

    searchInputRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        searchButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const term = query.trim();
    if (!term) return;
    router.push(`/shop?q=${encodeURIComponent(term)}`);
    setIsSearchOpen(false);
  };

  return (
    // Sticky only on large screens: the stacked 3-row layout is too tall to pin on phones
    <header className="relative z-40 border-b border-white/10 bg-neutral-950/95 text-neutral-100 backdrop-blur-md lg:sticky lg:top-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col divide-y divide-white/10 lg:h-20 lg:flex-row lg:items-center lg:gap-8 lg:divide-y-0">
          {/* Row 1: brand */}
          <div className="flex items-center justify-between py-4 lg:justify-start lg:gap-4 lg:py-0">
            <Link href="/" className="group flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition-transform group-hover:scale-105"
              >
                <Leaf size={22} />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-lg font-semibold text-emerald-400">{SITE.name}</span>
                <span className="text-xs uppercase tracking-wide text-neutral-300">
                  {SITE.tagline}
                </span>
              </span>
            </Link>
          </div>

          {/* Row 2: links */}
          <nav
            aria-label="Primary"
            className="flex items-center justify-between py-4 lg:flex-1 lg:justify-center lg:gap-10 lg:py-0"
          >
            <NavLinkItem href="/" active={pathname === '/'}>
              Home
            </NavLinkItem>

            {/* Shop: the link goes to /shop, the chevron opens the dropdown */}
            <div ref={shopRef} className="relative flex items-center gap-0.5">
              <NavLinkItem href="/shop" active={shopActive}>
                Shop
              </NavLinkItem>
              <button
                ref={shopToggleRef}
                type="button"
                onClick={() => setIsShopOpen((open) => !open)}
                aria-expanded={isShopOpen}
                aria-controls="shop-menu"
                aria-label="Toggle shop menu"
                className="cursor-pointer rounded p-1 text-neutral-300 transition-colors hover:text-emerald-400 focus-visible:outline-2 focus-visible:outline-emerald-400"
              >
                <ChevronDown
                  size={14}
                  aria-hidden="true"
                  className={`transition-transform ${isShopOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isShopOpen && (
                <ul
                  id="shop-menu"
                  className="absolute left-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-1.5 shadow-2xl"
                >
                  {SHOP_MENU.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsShopOpen(false)}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                        className={`block rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-emerald-400 ${
                          isActive(item.href) ? 'text-emerald-400' : 'text-neutral-100'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <NavLinkItem href="/choose" active={isActive('/choose')}>
              About
            </NavLinkItem>
            <NavLinkItem href="/news" active={isActive('/news')}>
              Blog
            </NavLinkItem>
            <NavLinkItem href="/contact" active={isActive('/contact')}>
              Contact
            </NavLinkItem>
          </nav>

          {/* Row 3: actions */}
          <div className="flex items-center justify-between py-3 lg:justify-end lg:gap-2 lg:py-0">
            <button
              ref={searchButtonRef}
              type="button"
              onClick={() => setIsSearchOpen((open) => !open)}
              aria-expanded={isSearchOpen}
              aria-controls="site-search"
              className={ICON_BUTTON}
            >
              <Search size={18} aria-hidden="true" />
              <span>Search</span>
            </button>

            <Link
              href="/account"
              aria-label="My account"
              aria-current={isActive('/account') ? 'page' : undefined}
              className={ICON_BUTTON}
            >
              <User size={18} aria-hidden="true" />
            </Link>

            <Link
              href="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'}`}
              aria-current={isActive('/wishlist') ? 'page' : undefined}
              className={ICON_BUTTON}
            >
              <Heart size={18} aria-hidden="true" />
              {wishlistCount > 0 && (
                <span aria-hidden="true" className={COUNT_BADGE}>
                  {formatCount(wishlistCount)}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={toggleCart}
              aria-haspopup="dialog"
              aria-label={`Open shopping bag, ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
              className={ICON_BUTTON}
            >
              <ShoppingBag size={18} aria-hidden="true" />
              {totalItems > 0 && (
                <span aria-hidden="true" className={COUNT_BADGE}>
                  {formatCount(totalItems)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search panel */}
        {isSearchOpen && (
          <form
            id="site-search"
            role="search"
            onSubmit={handleSearch}
            className="flex items-center gap-3 border-t border-white/10 py-3"
          >
            <Search size={18} className="shrink-0 text-neutral-400" aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                searchButtonRef.current?.focus();
              }}
              aria-label="Close search"
              className="cursor-pointer p-1 text-neutral-400 transition-colors hover:text-white"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </form>
        )}
      </div>
    </header>
  );
};