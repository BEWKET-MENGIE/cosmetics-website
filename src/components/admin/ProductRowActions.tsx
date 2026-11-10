// src/components/admin/ProductRowActions.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { patchJson } from '@/lib/api';

interface ProductRowActionsProps {
  id: string;
  isActive: boolean;
}

export const ProductRowActions: React.FC<ProductRowActionsProps> = ({ id, isActive }) => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const toggle = async () => {
    setBusy(true);
    setError('');
    const result = await patchJson(`/api/admin/products/${id}`, { isActive: !isActive });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  };

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className="cursor-pointer text-sm font-semibold text-slate-600 underline-offset-4 hover:text-rose-600 hover:underline disabled:opacity-60"
      >
        {busy ? 'Saving...' : isActive ? 'Hide' : 'Show'}
      </button>
      {error && (
        <p role="alert" className="text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
};