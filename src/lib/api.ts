// src/lib/api.ts  (used by the forms in the browser)

export interface ApiFailure {
  ok: false;
  status: number;
  code: string;
  error: string;
  fields: Record<string, string>;
}

export type ApiResult<T> = { ok: true; data: T } | ApiFailure;

export async function requestJson<T>(
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  url: string,
  body: unknown,
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data: unknown = await response.json().catch(() => null);

    if (response.ok) return { ok: true, data: data as T };

    const payload = (data ?? {}) as { code?: string; error?: string; fields?: Record<string, string> };
    return {
      ok: false,
      status: response.status,
      code: payload.code ?? 'server',
      error: payload.error ?? 'Something went wrong. Please try again.',
      fields: payload.fields ?? {},
    };
  } catch {
    return {
      ok: false,
      status: 0,
      code: 'network',
      error: 'We could not reach the server. Please check your connection and try again.',
      fields: {},
    };
  }
}

export const postJson = <T>(url: string, body: unknown) => requestJson<T>('POST', url, body);
export const patchJson = <T>(url: string, body: unknown) => requestJson<T>('PATCH', url, body);