// src/components/Shop/ShopSkeleton.tsx
import React from 'react';

/** Placeholder shown while the catalog reads the URL. */
export const ShopSkeleton: React.FC = () => {
  return (
    <div aria-busy="true" aria-label="Loading products" className="animate-pulse">
      <div className="mb-6 h-24 rounded-2xl bg-slate-200/70" />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-96 rounded-2xl bg-slate-200/70" />
        ))}
      </div>
    </div>
  );
};