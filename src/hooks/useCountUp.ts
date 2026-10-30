// src/hooks/useCountUp.ts
'use client';

import { useEffect, useState } from 'react';

interface UseCountUpOptions {
  /** Animation length in milliseconds. */
  duration?: number;
  /** The animation only starts when this is true (e.g. when scrolled into view). */
  enabled?: boolean;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Animates a number from 0 to `end`. Respects "prefers-reduced-motion". */
export function useCountUp(end: number, { duration = 2000, enabled = true }: UseCountUpOptions = {}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(end);
      return;
    }

    let frame = 0;
    let startTime: number | null = null;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(easeOutCubic(progress) * end);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame); // cleanup on unmount / re-run
  }, [end, duration, enabled]);

  return value;
}