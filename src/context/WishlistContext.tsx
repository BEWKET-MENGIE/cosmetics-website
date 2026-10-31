// src/context/WishlistContext.tsx
'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Product } from '@/types';

type ProductId = Product['id'];

const STORAGE_KEY = 'lumiere-wishlist';

interface WishlistContextValue {
  ids: ProductId[];
  count: number;
  /** False until the saved list has been read from localStorage. */
  isHydrated: boolean;
  has: (id: ProductId) => boolean;
  toggle: (id: ProductId) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ids, setIds] = useState<ProductId[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load the saved list once, after mount (localStorage doesn't exist on the server)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setIds(parsed.filter((v): v is ProductId => typeof v === 'string' || typeof v === 'number'));
        }
      }
    } catch {
      // Corrupted or blocked storage: start empty
    }
    setIsHydrated(true);
  }, []);

  // Save on every change, but only after the first load
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Storage full or blocked: the wishlist still works for this session
    }
  }, [ids, isHydrated]);

  const has = useCallback((id: ProductId) => ids.includes(id), [ids]);
  const toggle = useCallback(
    (id: ProductId) =>
      setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [],
  );
  const clear = useCallback(() => setIds([]), []);

  const value = useMemo<WishlistContextValue>(
    () => ({ ids, count: ids.length, isHydrated, has, toggle, clear }),
    [ids, isHydrated, has, toggle, clear],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
}