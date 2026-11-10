// src/components/admin/OrderActions.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { patchJson } from '@/lib/api';
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from './AdminUi';

type Action = 'mark_paid' | 'ship' | 'deliver' | 'cancel';

interface OrderActionsProps {
  number: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
}

export const OrderActions: React.FC<OrderActionsProps> = ({ number, status, paymentStatus, paymentMethod }) => {
  const router = useRouter();
  const [busy, setBusy] = useState<Action | null>(null);
  const [error, setError] = useState('');

  // The server checks all of this again. These only decide which buttons to show.
  const canMarkPaid = status !== 'cancelled' && paymentStatus !== 'paid';
  const canShip = (status === 'pending' || status === 'paid') && (paymentMethod === 'cod' || paymentStatus === 'paid');
  const canDeliver = status === 'shipped';
  const canCancel = status === 'pending' || status === 'paid';

  const run = async (action: Action) => {
    if (action === 'cancel' && !window.confirm('Cancel this order and put its items back in stock?')) return;

    setBusy(action);
    setError('');
    const result = await patchJson(`/api/admin/orders/${encodeURIComponent(number)}`, { action });
    setBusy(null);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  };

  const nothingToDo = !canMarkPaid && !canShip && !canDeliver && !canCancel;

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {canMarkPaid && (
          <button type="button" disabled={busy !== null} onClick={() => run('mark_paid')} className={SECONDARY_BUTTON}>
            {busy === 'mark_paid' ? 'Saving...' : 'Mark payment received'}
          </button>
        )}
        {canShip && (
          <button type="button" disabled={busy !== null} onClick={() => run('ship')} className={PRIMARY_BUTTON}>
            {busy === 'ship' ? 'Saving...' : 'Mark shipped'}
          </button>
        )}
        {canDeliver && (
          <button type="button" disabled={busy !== null} onClick={() => run('deliver')} className={PRIMARY_BUTTON}>
            {busy === 'deliver' ? 'Saving...' : 'Mark delivered'}
          </button>
        )}
        {canCancel && (
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => run('cancel')}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-rose-200 bg-white px-5 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy === 'cancel' ? 'Cancelling...' : 'Cancel and restock'}
          </button>
        )}
      </div>

      {nothingToDo && <p className="text-sm text-slate-500">This order is finished. No actions left.</p>}
      {canCancel && paymentStatus === 'paid' && paymentMethod !== 'cod' && (
        <p className="mt-3 text-xs text-slate-500">
          This order was paid online. After cancelling, refund it from the Chapa dashboard.
        </p>
      )}
      {!canShip && (status === 'pending' || status === 'paid') && paymentMethod !== 'cod' && paymentStatus !== 'paid' && (
        <p className="mt-3 text-xs text-slate-500">An online order can only ship after its payment is received.</p>
      )}
      {error && (
        <p role="alert" className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {error}
        </p>
      )}
    </div>
  );
};