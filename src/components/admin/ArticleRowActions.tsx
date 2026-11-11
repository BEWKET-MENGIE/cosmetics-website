// src/components/admin/ArticleRowActions.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { patchJson, requestJson } from '@/lib/api';

interface ArticleRowActionsProps {
  id: string;
  title: string;
  isPublished: boolean;
}

export const ArticleRowActions: React.FC<ArticleRowActionsProps> = ({ id, title, isPublished }) => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const togglePublished = async () => {
    setBusy(true);
    setError('');
    const result = await patchJson(`/api/admin/articles/${id}`, { isPublished: !isPublished });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  };

  const remove = async () => {
    if (!window.confirm(`Delete "${title}" for good? This cannot be undone.`)) return;
    setBusy(true);
    setError('');
    const result = await requestJson('DELETE', `/api/admin/articles/${id}`, {});
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  };

  const link = 'cursor-pointer text-sm font-semibold underline-offset-4 hover:underline disabled:opacity-60';

  return (
    <div>
      <div className="flex items-center gap-4">
        <button type="button" onClick={togglePublished} disabled={busy} className={`${link} text-slate-600 hover:text-rose-600`}>
          {isPublished ? 'Unpublish' : 'Publish'}
        </button>
        <button type="button" onClick={remove} disabled={busy} className={`${link} text-rose-600`}>
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