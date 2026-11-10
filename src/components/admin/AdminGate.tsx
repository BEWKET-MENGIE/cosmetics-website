// src/components/admin/AdminGate.tsx
import { notFound, redirect } from 'next/navigation';
import { getAdminState } from '@/server/admin';
import { AdminShell } from './AdminShell';

export async function AdminGate({ children }: { children: React.ReactNode }) {
  const state = await getAdminState();

  if (state.status === 'guest') redirect('/account'); // not signed in: go sign in
  if (state.status === 'forbidden') notFound(); // signed in but not an admin: pretend it does not exist

  return (
    <AdminShell name={state.admin.name} email={state.admin.email}>
      {children}
    </AdminShell>
  );
}