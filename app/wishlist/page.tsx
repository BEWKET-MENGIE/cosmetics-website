// app/wishlist/page.tsx
import type { Metadata } from 'next';
import { Heart } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export const metadata: Metadata = { title: 'Wishlist | LUMIÈRE' };

export default function WishlistPage() {
  return (
    <ComingSoon
      Icon={Heart}
      title="Your wishlist is coming soon"
      description="Saving favorites across visits is on its way. Meanwhile, you can add products straight to your shopping bag."
    />
  );
}