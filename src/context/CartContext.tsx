// src/context/CartContext.tsx
'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import type { Product } from '@/types';

export interface CartItem {
  id: Product['id'];
  name: string;
  price: number;
  image: string;
  quantity: number;
}

type CartProduct = Pick<Product, 'id' | 'name' | 'price' | 'image'>;

const STORAGE_KEY = 'lumiere-cart';
const MAX_QUANTITY = 99;

type CartAction =
  | { type: 'HYDRATE'; items: CartItem[] }
  | { type: 'ADD'; item: CartProduct; quantity: number }
  | { type: 'REMOVE'; id: CartItem['id'] }
  | { type: 'CHANGE_QUANTITY'; id: CartItem['id']; delta: number }
  | { type: 'CLEAR' };

const clamp = (n: number) => Math.min(Math.max(n, 1), MAX_QUANTITY);

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'HYDRATE':
      return action.items;

    case 'ADD': {
      const exists = state.some((i) => i.id === action.item.id);
      if (exists) {
        return state.map((i) =>
          i.id === action.item.id ? { ...i, quantity: clamp(i.quantity + action.quantity) } : i,
        );
      }
      const { id, name, price, image } = action.item;
      return [...state, { id, name, price, image, quantity: clamp(action.quantity) }];
    }

    case 'REMOVE':
      return state.filter((i) => i.id !== action.id);

    case 'CHANGE_QUANTITY':
      return state.map((i) =>
        i.id === action.id ? { ...i, quantity: clamp(i.quantity + action.delta) } : i,
      );

    case 'CLEAR':
      return [];
  }
}

const isCartItem = (value: unknown): value is CartItem => {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (typeof v.id === 'string' || typeof v.id === 'number') &&
    typeof v.name === 'string' &&
    typeof v.price === 'number' &&
    typeof v.image === 'string' &&
    typeof v.quantity === 'number'
  );
};

interface CartContextValue {
  cart: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleCart: () => void;
  /** False until the saved cart has been read from localStorage. */
  isHydrated: boolean;
  addToCart: (product: CartProduct, quantity?: number) => void;
  removeFromCart: (id: CartItem['id']) => void;
  /** Pass +1 or -1. Quantity stays between 1 and 99. */
  updateQuantity: (id: CartItem['id'], delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load the saved cart once, after mount (localStorage doesn't exist on the server)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          dispatch({ type: 'HYDRATE', items: parsed.filter(isCartItem) });
        }
      }
    } catch {
      // Corrupted or blocked storage: start with an empty cart
    }
    setIsHydrated(true);
  }, []);

  // Save on every change, but only after the first load (otherwise we'd wipe the saved cart)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Storage full or blocked: the cart still works for this session
    }
  }, [cart, isHydrated]);

  const toggleCart = useCallback(() => setIsOpen((open) => !open), []);

  const addToCart = useCallback((product: CartProduct, quantity = 1) => {
    dispatch({ type: 'ADD', item: product, quantity });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((id: CartItem['id']) => dispatch({ type: 'REMOVE', id }), []);

  const updateQuantity = useCallback(
    (id: CartItem['id'], delta: number) => dispatch({ type: 'CHANGE_QUANTITY', id, delta }),
    [],
  );

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const subtotal = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.quantity, 0), [cart]);
  const totalItems = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isOpen,
      setIsOpen,
      toggleCart,
      isHydrated,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      totalItems,
    }),
    [
      cart,
      isOpen,
      toggleCart,
      isHydrated,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      totalItems,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}