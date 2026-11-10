// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { LeftCategorySidebar } from '@/components/common/LeftCategorySidebar';
import { LanguageProvider } from '@/context/LanguageContext';
import { SITE_URL } from '@/lib/site';

const SITE_TITLE = 'LUMIÈRE | Natural Cosmetics';
const SITE_DESCRIPTION = 'Natural, science-backed cosmetics and skincare for radiant skin.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: 'LUMIÈRE',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: 'en_US',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f43f5e',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="scroll-smooth"
      style={
        {
          '--font-inter': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          '--font-playfair': 'Georgia, Cambria, "Times New Roman", Times, serif',
        } as React.CSSProperties
      }
    >
      <body className="flex min-h-screen flex-col bg-white font-sans text-slate-900 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-rose-500 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        
        <LanguageProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <LeftCategorySidebar />
              <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
                {children}
              </main>
              <Footer />
              <CartDrawer />
              <WhatsAppButton />
            </WishlistProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}