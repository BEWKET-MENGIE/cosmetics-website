// src/components/admin/AdminUi.tsx
import React from 'react';

export const TABLE_WRAP = 'overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm';
export const TH = 'whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500';
export const TD = 'px-4 py-3 text-sm text-slate-700';
export const PRIMARY_BUTTON =
  'inline-flex cursor-pointer items-center gap-2 rounded-full bg-rose-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60';
export const SECONDARY_BUTTON =
  'inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-rose-300 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60';

interface AdminHeadingProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const AdminHeading: React.FC<AdminHeadingProps> = ({ title, description, actions }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="font-serif text-3xl font-bold text-slate-900">{title}</h1>
      {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
    </div>
    {actions}
  </div>
);

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  warn?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, hint, warn }) => (
  <div className={`rounded-2xl border bg-white p-5 shadow-sm ${warn ? 'border-amber-300' : 'border-slate-200'}`}>
    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
    <p className="mt-2 font-serif text-3xl font-bold text-slate-900">{value}</p>
    {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
  </div>
);

const BADGE_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-emerald-100 text-emerald-800',
  shipped: 'bg-sky-100 text-sky-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-slate-200 text-slate-700',
  unpaid: 'bg-amber-100 text-amber-800',
  failed: 'bg-rose-100 text-rose-800',
  refunded: 'bg-slate-200 text-slate-700',
  new: 'bg-rose-100 text-rose-800',
  replied: 'bg-emerald-100 text-emerald-800',
  closed: 'bg-slate-200 text-slate-700',
  active: 'bg-emerald-100 text-emerald-800',
  hidden: 'bg-slate-200 text-slate-700',
  published: 'bg-emerald-100 text-emerald-800',
  draft: 'bg-slate-200 text-slate-700',
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`inline-block rounded-full px-3 py-1 text-xs font-bold capitalize ${
      BADGE_STYLES[status] ?? 'bg-slate-100 text-slate-700'
    }`}
  >
    {status}
  </span>
);

export const EmptyState: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-sm text-slate-500">
    {children}
  </div>
);