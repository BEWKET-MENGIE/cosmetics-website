import React from 'react';
import { CartView } from '@/components/cart/CartView';

export default function CartPage() {
  return (
    <main className="min-h-screen bg-slate-50">
        <link rel="stylesheet" href="cartview" >
          <CartView />
        </link>
    
    </main>
  );
}