// app/api/admin/products/[id]/route.ts
import { revalidateTag } from 'next/cache';
import { db } from '@/lib/db';
import { slugify } from '@/lib/products';
import { requireAdmin } from '@/server/admin';
import { productSchema, productToggleSchema } from '@/server/adminSchemas';
import { fieldErrors, json, readJson } from '@/server/http';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const refreshShop = () => {
  revalidateTag('products', { expire: 0 });
  revalidateTag('categories', { expire: 0 });
};

export async function PATCH(request: Request, { params }: RouteContext) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const existing = await db.product.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return json({ code: 'not_found', error: 'Product not found.' }, 404);

  const body = await readJson(request);

  // Quick hide / show from the list page
  const toggle = productToggleSchema.safeParse(body);
  if (toggle.success && body && typeof body === 'object' && Object.keys(body).length === 1) {
    await db.product.update({ where: { id }, data: { isActive: toggle.data.isActive } });
    refreshShop();
    return json({ ok: true });
  }

  const parsed = productSchema.safeParse(body);
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

  const taken = await db.product.findFirst({ where: { slug, NOT: { id } }, select: { id: true } });
  if (taken) {
    return json({ code: 'validation', error: 'Please check the highlighted fields.', fields: { slug: 'This address is already used by another product.' } }, 409);
  }

  try {
    await db.product.update({
      where: { id },
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
    });
    refreshShop();
    return json({ ok: true });
  } catch (error) {
    console.error('Admin product update failed', error);
    return json({ code: 'server', error: 'We could not save the product. Please try again.' }, 500);
  }
}