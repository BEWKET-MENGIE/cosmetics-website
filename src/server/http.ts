// src/server/http.ts
import { NextResponse } from 'next/server';
import type { ZodError } from 'zod';

export function json(body: unknown, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers });
}

/** The parsed JSON body, or null when it is missing or not valid JSON. */
export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

/** { "customer.phone": "Enter a valid mobile number." } */
export function fieldErrors(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join('.') || 'form';
    if (!(key in fields)) fields[key] = issue.message;
  }
  return fields;
}