// app/admin/articles/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdminHeading } from '@/components/admin/AdminUi';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { db } from '@/lib/db';
import { parseArticleBody } from '@/server/content';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;

  const [article, categories] = await Promise.all([
    db.article.findUnique({ where: { id } }),
    db.article.findMany({ distinct: ['category'], select: { category: true } }),
  ]);
  if (!article) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/articles" className="text-sm font-semibold text-slate-600 hover:text-rose-600">
        ← All articles
      </Link>
      <AdminHeading
        title={article.title}
        actions={
          article.isPublished ? (
            <Link href={`/news/${article.slug}`} className="text-sm font-semibold text-rose-600 hover:underline">
              View on the site
            </Link>
          ) : undefined
        }
      />
      <ArticleForm
        articleId={article.id}
        categories={categories.map((row) => row.category)}
        initial={{
          title: article.title,
          slug: article.slug,
          category: article.category,
          excerpt: article.excerpt,
          image: article.image,
          imageAlt: article.imageAlt,
          authorName: article.authorName,
          authorRole: article.authorRole,
          publishedAt: article.publishedAt.toISOString().slice(0, 10),
          featured: article.featured,
          isPublished: article.isPublished,
          body: parseArticleBody(article.body),
        }}
      />
    </div>
  );
}