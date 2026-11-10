// app/admin/products/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdminHeading } from '@/components/admin/AdminUi';
import { ProductForm } from '@/components/admin/ProductForm';
import { db } from '@/lib/db';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, name: true } }),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/products" className="text-sm font-semibold text-slate-600 hover:text-rose-600">
        ← All products
      </Link>
      <AdminHeading
        title={product.name}
        description={`Rating ${product.rating.toFixed(1)} from ${product.reviewsCount} reviews (these are not edited here)`}
        actions={
          product.isActive ? (
            <Link href={`/shop/${product.slug}`} className="text-sm font-semibold text-rose-600 hover:underline">
              View in shop
            </Link>
          ) : undefined
        }
      />
      <ProductForm
        categories={categories}
        productId={product.id}
        initial={{
          name: product.name,
          slug: product.slug,
          categoryId: product.categoryId,
          description: product.description,
          image: product.image,
          price: String(product.price),
          stock: String(product.stock),
          isNew: product.isNew,
          isBestSeller: product.isBestSeller,
          featured: product.featured,
          isActive: product.isActive,
        }}
      />
    </div>
  );
}