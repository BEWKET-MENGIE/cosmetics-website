import React from 'react';
import { ShopCatalog } from '@/components/Shop/ShopCatalog'; // Matches your src/components/Shop folder

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <ShopCatalog />
    </main>
  );
}