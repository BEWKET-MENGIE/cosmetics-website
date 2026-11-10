// app/admin/products/new/page.tsx
import { AdminHeading } from '@/components/admin/AdminUi';
import { ProductForm } from '@/components/admin/ProductForm';
import { db } from '@/lib/db';

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true },
  });

  return (
    <div>
      <AdminHeading title="New product" />
      <ProductForm categories={categories} />
    </div>
  );
}