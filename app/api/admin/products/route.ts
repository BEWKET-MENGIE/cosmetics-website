// app/api/admin/products/route.ts
import { revalidateTag } from 'next/cache';
import { db } from '@/lib/db';
import { slugify } from '@/lib/products';
import { requireAdmin } from '@/server/admin';
import { productSchema } from '@/server/adminSchemas';
import { fieldErrors, json, readJson } from '@/server/http';

export async function POST(request: Request) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const parsed = productSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return json(
      { code: 'validation', error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error) },
      400,
    );
  }
  const data = parsed.data;
  const slug = data.slug || slugify(data.name);
  if (!slug) return json({ code: 'validation', error: 'Please check the name.', fields: { name: 'Use letters or numbers.' } }, 400);

  const category = await db.category.findUnique({ where: { id: data.categoryId }, select: { id: true } });
  if (!category) return json({ code: 'validation', error: 'Please check the highlighted fields.', fields: { categoryId: 'Choose a category.' } }, 400);

  const taken = await db.product.findUnique({ where: { slug }, select: { id: true } });
  if (taken) {
    return json({ code: 'validation', error: 'Please check the highlighted fields.', fields: { slug: 'This address is already used by another product.' } }, 409);
  }

  try {
    const product = await db.product.create({
      data: {
        slug,
        name: data.name,
        description: data.description,
        image: data.image,
        price: data.price,
        stock: data.stock,
        isNew: data.isNew,
        isBestSeller: data.isBestSeller,
        featured: data.featured,
        isActive: data.isActive,
        categoryId: data.categoryId,
      },
      select: { id: true },
    });

    // Make the shop show the change straight away
    revalidateTag('products', { expire: 0 });
    revalidateTag('categories', { expire: 0 });

    return json({ product }, 201);
  } catch (error) {
    console.error('Admin product create failed', error);
    return json({ code: 'server', error: 'We could not save the product. Please try again.' }, 500);
  }
}