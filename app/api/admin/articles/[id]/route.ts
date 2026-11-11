// app/api/admin/articles/[id]/route.ts
import { revalidateTag } from 'next/cache';
import { db } from '@/lib/db';
import { slugify } from '@/lib/products';
import { requireAdmin } from '@/server/admin';
import { articleSchema, articleToggleSchema, parsePublishedDate } from '@/server/adminSchemas';
import { fieldErrors, json, readJson } from '@/server/http';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const existing = await db.article.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return json({ code: 'not_found', error: 'Article not found.' }, 404);

  const body = await readJson(request);

  // Quick publish / unpublish from the list page
  const toggle = articleToggleSchema.safeParse(body);
  if (toggle.success && body && typeof body === 'object' && Object.keys(body).length === 1) {
    await db.article.update({ where: { id }, data: { isPublished: toggle.data.isPublished } });
    revalidateTag('articles', { expire: 0 });
    return json({ ok: true });
  }

  const parsed = articleSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      { code: 'validation', error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error) },
      400,
    );
  }
  const data = parsed.data;

  const publishedAt = parsePublishedDate(data.publishedAt);
  if (!publishedAt) {
    return json({ code: 'validation', error: 'Please check the highlighted fields.', fields: { publishedAt: 'Choose a valid date.' } }, 400);
  }

  const slug = data.slug || slugify(data.title);
  if (!slug) {
    return json({ code: 'validation', error: 'Please check the highlighted fields.', fields: { title: 'Use letters or numbers.' } }, 400);
  }

  const taken = await db.article.findFirst({ where: { slug, NOT: { id } }, select: { id: true } });
  if (taken) {
    return json({ code: 'validation', error: 'Please check the highlighted fields.', fields: { slug: 'This address is already used by another article.' } }, 409);
  }

  try {
    await db.$transaction(async (tx) => {
      if (data.featured) {
        await tx.article.updateMany({ where: { featured: true, NOT: { id } }, data: { featured: false } });
      }
      await tx.article.update({
        where: { id },
        data: {
          slug,
          title: data.title,
          category: data.category,
          publishedAt,
          authorName: data.authorName,
          authorRole: data.authorRole,
          excerpt: data.excerpt,
          image: data.image,
          imageAlt: data.imageAlt,
          featured: data.featured,
          isPublished: data.isPublished,
          body: JSON.stringify(data.body),
        },
      });
    });

    revalidateTag('articles', { expire: 0 });
    return json({ ok: true });
  } catch (error) {
    console.error('Admin article update failed', error);
    return json({ code: 'server', error: 'We could not save the article. Please try again.' }, 500);
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const result = await db.article.deleteMany({ where: { id } });
  if (result.count === 0) return json({ code: 'not_found', error: 'Article not found.' }, 404);

  revalidateTag('articles', { expire: 0 });
  return json({ ok: true });
}