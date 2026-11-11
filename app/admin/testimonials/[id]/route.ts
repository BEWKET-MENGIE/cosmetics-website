// app/api/admin/testimonials/[id]/route.ts
import { revalidateTag } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/server/admin';
import { testimonialToggleSchema } from '@/server/adminSchemas';
import { json, readJson } from '@/server/http';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** Approve (publish) or hide a testimonial. */
export async function PATCH(request: Request, { params }: RouteContext) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const parsed = testimonialToggleSchema.safeParse(await readJson(request));
  if (!parsed.success) return json({ code: 'validation', error: 'Unknown change.' }, 400);

  const result = await db.testimonial.updateMany({ where: { id }, data: { isPublished: parsed.data.isPublished } });
  if (result.count === 0) return json({ code: 'not_found', error: 'Testimonial not found.' }, 404);

  revalidateTag('testimonials', { expire: 0 });
  return json({ ok: true });
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const result = await db.testimonial.deleteMany({ where: { id } });
  if (result.count === 0) return json({ code: 'not_found', error: 'Testimonial not found.' }, 404);

  revalidateTag('testimonials', { expire: 0 });
  return json({ ok: true });
}