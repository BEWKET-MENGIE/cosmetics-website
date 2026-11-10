// src/components/admin/MessageActions.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { patchJson } from '@/lib/api';
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from './AdminUi';

interface MessageActionsProps {
  id: string;
  status: string;
  email: string;
  subject: string;
}

export const MessageActions: React.FC<MessageActionsProps> = ({ id, status, email, subject }) => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const setStatus = async (next: 'new' | 'replied' | 'closed') => {
    setBusy(true);
    setError('');
    const result = await patchJson(`/api/admin/messages/${id}`, { status: next });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <a
          href={`mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`}
          className={PRIMARY_BUTTON}
        >
          Reply by email
        </a>
        {status !== 'replied' && (
          <button type="button" disabled={busy} onClick={() => setStatus('replied')} className={SECONDARY_BUTTON}>
            Mark replied
          </button>
        )}
        {status !== 'closed' && (
          <button type="button" disabled={busy} onClick={() => setStatus('closed')} className={SECONDARY_BUTTON}>
            Close
          </button>
        )}
        {status !== 'new' && (
          <button type="button" disabled={busy} onClick={() => setStatus('new')} className={SECONDARY_BUTTON}>
            Reopen
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
};