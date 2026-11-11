// src/components/admin/TestimonialActions.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { patchJson, requestJson } from '@/lib/api';

interface TestimonialActionsProps {
  id: string;
  name: string;
  isPublished: boolean;
}

export const TestimonialActions: React.FC<TestimonialActionsProps> = ({ id, name, isPublished }) => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const toggle = async () => {
    setBusy(true);
    setError('');
    const result = await patchJson(`/api/admin/testimonials/${id}`, { isPublished: !isPublished });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  };

  const remove = async () => {
    if (!window.confirm(`Delete the review from ${name} for good?`)) return;
    setBusy(true);
    setError('');
    const result = await requestJson('DELETE', `/api/admin/testimonials/${id}`, {});
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          disabled={busy}
          className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold transition-colors disabled:opacity-60 ${
            isPublished
              ? 'border border-slate-200 bg-white text-slate-700 hover:border-rose-300'
              : 'bg-emerald-500 text-white hover:bg-emerald-600'
          }`}
        >
          {isPublished ? 'Hide' : 'Approve'}
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          className="cursor-pointer text-sm font-semibold text-rose-600 underline-offset-4 hover:underline disabled:opacity-60"
        >
          Delete
        </button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
};