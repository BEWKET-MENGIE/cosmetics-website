// src/lib/auth.ts
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { db } from '@/lib/db';

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: 'sqlite' }),
  emailAndPassword: {
    enabled: true,
    // TODO (Phase 5): turn on email verification and password reset once emails are sent
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // stay signed in for 30 days
    updateAge: 60 * 60 * 24, // refresh the session once a day
  },
  // Must be the LAST plugin
  plugins: [nextCookies()],
});