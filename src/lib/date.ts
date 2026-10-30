// src/lib/date.ts

/** "Oct 24, 2026". Fixed locale and UTC so server and browser always match. */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso));
}