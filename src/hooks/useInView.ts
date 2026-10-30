// src/hooks/useInView.ts
'use client';

import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  /** Fraction of the element that must be visible (0–1). */
  threshold?: number;
  /** Stop observing after the first time the element becomes visible. */
  once?: boolean;
}

/** Tells you when an element scrolls into view (IntersectionObserver). */
export function useInView<T extends Element = HTMLDivElement>({
  threshold = 0.3,
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Very old browsers: just show the final state.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  return { ref, inView };
}