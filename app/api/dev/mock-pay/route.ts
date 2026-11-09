// app/api/dev/mock-pay/route.ts
import { isMockMode, setMockResult } from '@/server/chapa';
import { json, readJson } from '@/server/http';

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production' || !isMockMode()) {
    return json({ error: 'Not found' }, 404);
  }

  const body = (await readJson(request)) as { txRef?: unknown; outcome?: unknown } | null;
  if (typeof body?.txRef !== 'string' || (body.outcome !== 'success' && body.outcome !== 'failed')) {
    return json({ error: 'Bad request' }, 400);
  }

  setMockResult(body.txRef, body.outcome);
  return json({ ok: true });
}