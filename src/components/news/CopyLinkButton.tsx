// src/components/news/CopyLinkButton.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, Link2 } from 'lucide-react';

export const CopyLinkButton: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context): nothing to do
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-rose-300 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
      >
        {copied ? <Check size={14} aria-hidden="true" /> : <Link2 size={14} aria-hidden="true" />}
        {copied ? 'Link copied' : 'Copy link'}
      </button>
      <span role="status" className="sr-only">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </>
  );
};