// app/api/admin/messages/[id]/route.ts
import { db } from '@/lib/db';
import { requireAdmin } from '@/server/admin';
import { messageStatusSchema } from '@/server/adminSchemas';
import { json, readJson } from '@/server/http';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const parsed = messageStatusSchema.safeParse(await readJson(request));
  if (!parsed.success) return json({ code: 'validation', error: 'Unknown status.' }, 400);

  const result = await db.contactMessage.updateMany({ where: { id }, data: { status: parsed.data.status } });
  if (result.count === 0) return json({ code: 'not_found', error: 'Message not found.' }, 404);

  return json({ ok: true });
}