// src/lib/format.ts

/**
 * Formats a number as currency (used by the Hero sections, USD by default).
 * The locale is fixed on purpose so the server and the browser always render
 * the same string (no hydration mismatch).
 */
export function formatPrice(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

/** Formats a number as "1,250 ETB" with a fixed locale (used by the cart and product cards). */
export function formatETB(amount: number): string {
  return `${amount.toLocaleString('en-US')} ETB`;
}