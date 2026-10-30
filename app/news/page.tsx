// app/news/page.tsx
import type { Metadata } from 'next';
import { NewsHero } from '@/components/news/NewsHero';
import { JournalFeed } from '@/components/news/JournalFeed';
import { Newsletter } from '@/components/news/Newsletter';

export const metadata: Metadata = {
  title: 'Journal | LUMIÈRE',
  description: 'Skincare tips, ingredient guides and beauty routines from the Lumière team.',
};

export default function NewsPage() {
  return (
    <>
      <NewsHero />
      <JournalFeed />
      <Newsletter />
    </>
  );
}