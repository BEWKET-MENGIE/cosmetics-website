// app/account/page.tsx
import type { Metadata } from 'next';
import { User } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export const metadata: Metadata = { title: 'My Account | LUMIÈRE' };

export default function AccountPage() {
  return (
    <ComingSoon
      Icon={User}
      title="Accounts are coming soon"
      description="Soon you will be able to sign in, track your orders and save your details. For now, you can shop as a guest."
    />
  );
}