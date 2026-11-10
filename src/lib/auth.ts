// src/lib/auth.ts
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { db } from '@/lib/db';
import { notifyPasswordReset, notifyVerifyEmail } from '@/server/email/notify';
import { sendInBackground } from '@/server/email/send';

// Always on in production. In development, REQUIRE_EMAIL_VERIFICATION=true switches it on to test the flow.
const requireVerification =
  process.env.NODE_ENV === 'production' || process.env.REQUIRE_EMAIL_VERIFICATION === 'true';

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: 'sqlite' }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: requireVerification,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      sendInBackground(() => notifyPasswordReset(user, url));
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      sendInBackground(() => notifyVerifyEmail(user, url));
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // stay signed in for 30 days
    updateAge: 60 * 60 * 24, // refresh the session once a day
  },
  // Must be the LAST plugin
  plugins: [nextCookies()],
});