// app/admin/articles/new/page.tsx
import { connection } from 'next/server';
import { AdminHeading } from '@/components/admin/AdminUi';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { db } from '@/lib/db';

export default async function NewArticlePage() {
  await connection(); // today's date below is computed per request

  const rows = await db.article.findMany({ distinct: ['category'], select: { category: true } });

  return (
    <div>
      <AdminHeading title="New article" />
      <ArticleForm
        categories={rows.map((row) => row.category)}
        initial={{
          title: '',
          slug: '',
          category: '',
          excerpt: '',
          image: '/images/journal/article-1.jpg',
          imageAlt: '',
          authorName: '',
          authorRole: '',
          publishedAt: new Date().toISOString().slice(0, 10),
          featured: false,
          isPublished: false,
          body: [{ type: 'paragraph', text: '' }],
        }}
      />
    </div>
  );
}