// src/server/email/send.ts
import { after } from 'next/server';
import { Resend } from 'resend';

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  headers?: Record<string, string>;
  /** Same key within 24 hours = sent only once, even if the code runs twice */
  idempotencyKey?: string;
}

const FROM = process.env.EMAIL_FROM ?? 'LUMIÈRE <onboarding@resend.dev>';

let client: Resend | null = null;
function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  client ??= new Resend(key);
  return client;
}

/**
 * Sends one email. Never throws. Returns false if it could not be sent.
 * In log mode (the default in development) the email is printed in the terminal instead.
 */
export async function sendEmail(message: EmailMessage): Promise<boolean> {
  const resend = process.env.EMAIL_MODE === 'resend' ? getClient() : null;

  if (!resend) {
    if (process.env.NODE_ENV === 'production') {
      console.error(`Email NOT sent (EMAIL_MODE=resend and RESEND_API_KEY are required): "${message.subject}"`);
      return false;
    }
    console.log(
      `\n---------- EMAIL (log mode) ----------\nTo: ${message.to}\nSubject: ${message.subject}\n\n${message.text}\n--------------------------------------\n`,
    );
    return true;
  }

  try {
    const { error } = await resend.emails.send(
      {
        from: FROM,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        replyTo: message.replyTo,
        headers: message.headers,
      },
      message.idempotencyKey ? { idempotencyKey: message.idempotencyKey } : undefined,
    );

    if (error) {
      console.error('Email failed', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Email failed', error);
    return false;
  }
}

/**
 * Runs the task after the response has been sent, so the customer never waits for an email
 * (and response time can't reveal whether an account exists).
 */
export function sendInBackground(task: () => Promise<unknown>): void {
  const run = () => task().catch((error) => console.error('Background email failed', error));
  try {
    after(run);
  } catch {
    // Not inside a request: just run it
    void run();
  }
}