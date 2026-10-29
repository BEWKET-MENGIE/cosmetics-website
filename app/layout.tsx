import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/footer/Footer';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'LUMIÈRE - Luxury & Organic Cosmetics',
  description: 'Elevate your skincare and beauty routine with dermatologist-approved luxury products.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-white text-slate-900 antialiased selection:bg-rose-500 selection:text-white">
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}