// src/components/admin/AdminShell.tsx
import React from 'react';
import { AdminNav } from './AdminNav';

interface AdminShellProps {
  name: string;
  email: string;
  children: React.ReactNode;
}

export const AdminShell: React.FC<AdminShellProps> = ({ name, email, children }) => {
  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="font-serif text-xl font-bold text-slate-900">Admin</p>
            <p className="text-xs text-slate-500">
              {name} · {email}
            </p>
          </div>
          <AdminNav />
        </div>
      </div>
      <div className="mx-auto min-h-[60vh] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
};