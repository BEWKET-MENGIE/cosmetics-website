// app/news/page.tsx
import type { Metadata } from 'next';
import { NewsHero } from '@/components/news/NewsHero';
import { JournalFeed } from '@/components/news/JournalFeed';
import { Newsletter } from '@/components/news/Newsletter';
import { getArticles } from '@/server/content';

export const metadata: Metadata = {
  title: 'Journal | LUMIÈRE',
  description: 'Skincare tips, ingredient guides and beauty routines from the Lumière team.',
};

export default async function NewsPage() {
  const articles = await getArticles();

  return (
    <>
      <NewsHero />
      {articles.length > 0 ? (
        <JournalFeed articles={articles} />
      ) : (
        <p className="py-20 text-center text-slate-600">New articles are coming soon.</p>
      )}
      <Newsletter />
    </>
  );
}