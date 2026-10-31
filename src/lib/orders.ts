// src/lib/orders.ts  (replace the whole file)
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/lib/constants';

export type PaymentMethod = 'cod' | 'telebirr' | 'cbe' | 'chapa';

export const PAYMENT_METHODS: { value: PaymentMethod; label: string; description: string }[] = [
  { value: 'cod', label: 'Cash on delivery', description: 'Pay in cash when your order arrives.' },
  {
    value: 'telebirr',
    label: 'Telebirr',
    description: 'We will send you payment instructions after you place the order.',
  },
  {
    value: 'cbe',
    label: 'CBE Birr / bank transfer',
    description: 'We will send you payment instructions after you place the order.',
  },
  {
    value: 'chapa',
    label: 'Card or mobile money (Chapa)',
    description: 'We will send you a secure payment link after you place the order.',
  },
];

export interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  /** ISO date-time */
  placedAt: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: { fullName: string; phone: string; email: string };
  address: { city: string; details: string; notes: string };
  paymentMethod: PaymentMethod;
}

export const calcShipping = (subtotal: number): number =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

/** e.g. "LUM-M2K9F3-7QXA". Call it from an event handler, not during render. */
export function createOrderId(): string {
  const time = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LUM-${time}-${random}`;
}

const LAST_ORDER_KEY = 'lumiere-last-order';
const HISTORY_KEY = 'lumiere-orders';
const MAX_HISTORY = 20;

const isOrder = (value: unknown): value is Order => {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === 'string' && Array.isArray(v.items) && typeof v.total === 'number';
};

/** Newest first. Returns [] when storage is empty, blocked or corrupted. */
export function loadOrderHistory(): Order[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isOrder) : [];
  } catch {
    return [];
  }
}

export function clearOrderHistory(): void {
  try {
    window.localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Storage blocked: nothing to clear
  }
}

/**
 * Saves the order for the confirmation page (this tab only) and adds it to the
 * history shown in My Account (this browser).
 */
export function saveLastOrder(order: Order): void {
  try {
    window.sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {
    // Storage blocked: the confirmation page will show "no recent order"
  }

  try {
    const history = [order, ...loadOrderHistory().filter((o) => o.id !== order.id)].slice(0, MAX_HISTORY);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Storage full or blocked: the order is still confirmed, just not listed in the account
  }
}

export function loadLastOrder(): Order | null {
  try {
    const raw = window.sessionStorage.getItem(LAST_ORDER_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isOrder(parsed) ? parsed : null;
  } catch {
    return null;
  }
}