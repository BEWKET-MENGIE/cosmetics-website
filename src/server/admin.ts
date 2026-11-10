// src/server/admin.ts
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { SITE_URL } from '@/lib/site';
import { json } from '@/server/http';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

const adminEmails = () =>
  (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

function toAdmin(session: Session): AdminUser | null {
  if (!session) return null;
  const { id, name, email, emailVerified } = session.user;
  // The email must be verified AND on the list
  if (!emailVerified || !adminEmails().includes(email.toLowerCase())) return null;
  return { id, name, email };
}

export type AdminState =
  | { status: 'guest' }
  | { status: 'forbidden' }
  | { status: 'admin'; admin: AdminUser };

/** For pages and layouts. */
export async function getAdminState(): Promise<AdminState> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { status: 'guest' };
  const admin = toAdmin(session);
  return admin ? { status: 'admin', admin } : { status: 'forbidden' };
}

export type AdminCheck = { ok: true; admin: AdminUser } | { ok: false; response: Response };

/** For EVERY /api/admin route handler. Call it first and return its response if it fails. */
export async function requireAdmin(request: Request): Promise<AdminCheck> {
  // Changes only from our own site (a second lock next to the SameSite cookie)
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(SITE_URL).origin) {
      return { ok: false, response: json({ code: 'forbidden', error: 'Cross-site request blocked.' }, 403) };
    }
  }

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return { ok: false, response: json({ code: 'unauthorized', error: 'Please sign in.' }, 401) };
  }

  const admin = toAdmin(session);
  if (!admin) {
    return { ok: false, response: json({ code: 'forbidden', error: 'You do not have access.' }, 403) };
  }
  return { ok: true, admin };
}