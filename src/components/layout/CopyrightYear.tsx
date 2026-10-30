// src/components/layout/CopyrightYear.tsx
'use client';

import { useSyncExternalStore } from 'react';
import type { FC } from 'react';

// The year never changes while the page is open, so there is nothing to subscribe to
const subscribe = () => () => {};
const getClientYear = () => new Date().getFullYear();
// Used on the server and during hydration, which keeps both sides identical
// and avoids Next.js 16's "blocking-prerender-current-time-client" error.
const getServerYear = () => 2026;

export const CopyrightYear: FC = () => {
  const year = useSyncExternalStore(subscribe, getClientYear, getServerYear);
  return <>{year}</>;
};