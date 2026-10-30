// src/components/cart/FreeShippingProgress.tsx
import React from 'react';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import { formatETB } from '@/lib/format';

interface FreeShippingProgressProps {
  subtotal: number;
  className?: string;
}

export const FreeShippingProgress: React.FC<FreeShippingProgressProps> = ({
  subtotal,
  className = '',
}) => {
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <div className={`bg-rose-50 ${className}`}>
      <p className="mb-1.5 text-xs font-medium text-rose-700">
        {remaining > 0
          ? `Add ${formatETB(remaining)} more for Free Shipping!`
          : '🎉 You have unlocked Free Shipping!'}
      </p>
      <div
        role="progressbar"
        aria-label="Free shipping progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        className="h-2 w-full overflow-hidden rounded-full bg-rose-200/60"
      >
        <div
          className="h-full rounded-full bg-rose-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};