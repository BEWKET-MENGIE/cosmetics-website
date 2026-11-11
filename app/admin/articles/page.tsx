// app/admin/articles/page.tsx
import Link from 'next/link';
import { AdminHeading, EmptyState, PRIMARY_BUTTON, StatusBadge, TABLE_WRAP, TD, TH } from '@/components/admin/AdminUi';
import { ArticleRowActions } from '@/components/admin/ArticleRowActions';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/date';

export default async function AdminArticlesPage() {
  const articles = await db.article.findMany({
    orderBy: { publishedAt: 'desc' },
    select: { id: true, slug: true, title: true, category: true, publishedAt: true, featured: true, isPublished: true },
  });

  return (
    <div>
      <AdminHeading
        title="Articles"
        description={`${articles.length} ${articles.length === 1 ? 'article' : 'articles'} in the Journal`}
        actions={
          <Link href="/admin/articles/new" className={PRIMARY_BUTTON}>
            New article
          </Link>
        }
      />

      {articles.length === 0 ? (
        <EmptyState>No articles yet. Write the first one.</EmptyState>
      ) : (
        <div className={TABLE_WRAP}>
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr>
                <th className={TH}>Title</th>
                <th className={TH}>Category</th>
                <th className={TH}>Date</th>
                <th className={TH}>Status</th>
                <th className={TH}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className={TD}>
                    <Link href={`/admin/articles/${article.id}`} className="font-semibold text-slate-900 hover:text-rose-600">
                      {article.title}
                    </Link>
                    {article.featured && <p className="text-xs font-semibold text-rose-600">Featured</p>}
                  </td>
                  <td className={TD}>{article.category}</td>
                  <td className={TD}>{formatDate(article.publishedAt.toISOString())}</td>
                  <td className={TD}>
                    <StatusBadge status={article.isPublished ? 'published' : 'draft'} />
                  </td>
                  <td className={TD}>
                    <div className="flex items-center gap-4">
                      <Link href={`/admin/articles/${article.id}`} className="text-sm font-semibold text-rose-600 hover:underline">
                        Edit
                      </Link>
                      <ArticleRowActions id={article.id} title={article.title} isPublished={article.isPublished} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}