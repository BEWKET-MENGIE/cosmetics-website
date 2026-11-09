// src/server/chapa.ts
import { createHmac, timingSafeEqual } from 'node:crypto';
import { SITE_URL } from '@/lib/site';

const BASE_URL = 'https://api.chapa.co/v1';
const TIMEOUT_MS = 15_000;

export class PaymentError extends Error {}

/**
 * Mock mode fakes the payment page so you can test without a Chapa account.
 * It is on when PAYMENT_MODE=mock, or when no key is set outside production.
 */
export const isMockMode = () =>
  process.env.PAYMENT_MODE === 'mock' ||
  (!process.env.CHAPA_SECRET_KEY && process.env.NODE_ENV !== 'production');

function secretKey(): string {
  const key = process.env.CHAPA_SECRET_KEY;
  if (!key) throw new PaymentError('CHAPA_SECRET_KEY is not set');
  return key;
}

// ------------------------------------------------------------ mock results
type MockResult = 'success' | 'failed';
const globalMock = globalThis as unknown as { __mockPayments?: Map<string, MockResult> };
const mockStore = () => (globalMock.__mockPayments ??= new Map<string, MockResult>());

export const setMockResult = (txRef: string, result: MockResult) => {
  mockStore().set(txRef, result);
};

// ------------------------------------------------------------------ initialize
export interface InitializeParams {
  txRef: string;
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  returnUrl: string;
  title: string;
  description: string;
}

/** Returns the page the customer should be sent to in order to pay. */
export async function initializePayment(params: InitializeParams): Promise<string> {
  if (isMockMode()) {
    return `${SITE_URL}/dev/mock-checkout?tx_ref=${encodeURIComponent(params.txRef)}&return=${encodeURIComponent(params.returnUrl)}`;
  }

  const response = await fetch(`${BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secretKey()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: String(params.amount),
      currency: 'ETB',
      email: params.email,
      first_name: params.firstName,
      last_name: params.lastName,
      phone_number: params.phone,
      tx_ref: params.txRef,
      return_url: params.returnUrl,
      customization: { title: params.title, description: params.description },
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  const body = (await response.json().catch(() => null)) as {
    status?: string;
    message?: unknown;
    data?: { checkout_url?: string };
  } | null;

  const url = body?.data?.checkout_url;
  if (!response.ok || body?.status !== 'success' || !url) {
    // Chapa's message can be an object; it stays in the server log and never reaches the customer
    throw new PaymentError(`Chapa initialize failed: ${JSON.stringify(body?.message ?? response.status)}`);
  }
  return url;
}

// ---------------------------------------------------------------------- verify
export interface VerifiedPayment {
  status: 'success' | 'failed' | 'pending';
  amount: number;
  currency: string;
  txRef: string;
}

export async function verifyPayment(txRef: string, expectedAmount: number): Promise<VerifiedPayment> {
  if (isMockMode()) {
    const result = mockStore().get(txRef);
    return { status: result ?? 'pending', amount: expectedAmount, currency: 'ETB', txRef };
  }

  const response = await fetch(`${BASE_URL}/transaction/verify/${encodeURIComponent(txRef)}`, {
    headers: { Authorization: `Bearer ${secretKey()}` },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  // The customer has not reached or finished the payment page yet
  if (response.status >= 400 && response.status < 500) {
    return { status: 'pending', amount: 0, currency: '', txRef };
  }

  const body = (await response.json().catch(() => null)) as {
    data?: { status?: string; amount?: number | string; currency?: string; tx_ref?: string };
  } | null;

  if (!response.ok || !body?.data) {
    throw new PaymentError(`Chapa verify failed with status ${response.status}`);
  }

  const raw = String(body.data.status ?? '').toLowerCase();
  const status: VerifiedPayment['status'] =
    raw === 'success'
      ? 'success'
      : ['failed', 'cancelled', 'canceled', 'reversed'].includes(raw)
        ? 'failed'
        : 'pending';

  return {
    status,
    amount: Number(body.data.amount),
    currency: String(body.data.currency ?? ''),
    txRef: String(body.data.tx_ref ?? txRef),
  };
}

// --------------------------------------------------------------------- webhook
const hmac = (key: string, text: string) => createHmac('sha256', key).update(text).digest('hex');

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * Chapa signs webhooks with HMAC SHA256: `x-chapa-signature` covers the payload and
 * `chapa-signature` covers the secret itself. Either one being valid is enough.
 * The handler also re-verifies the payment with Chapa, so this is a second lock.
 */
export function isValidWebhookSignature(rawBody: string, headers: Headers): boolean {
  const keys = [process.env.CHAPA_WEBHOOK_SECRET, process.env.CHAPA_SECRET_KEY].filter(
    (key): key is string => Boolean(key),
  );
  const received = [headers.get('x-chapa-signature'), headers.get('chapa-signature')].filter(
    (value): value is string => Boolean(value),
  );
  if (keys.length === 0 || received.length === 0) return false;

  let compact = rawBody;
  try {
    compact = JSON.stringify(JSON.parse(rawBody));
  } catch {
    // Not JSON: only the raw text is checked
  }

  return keys.some((key) => {
    const expected = [hmac(key, rawBody), hmac(key, compact), hmac(key, key)];
    return received.some((value) => expected.some((candidate) => safeEqual(value, candidate)));
  });
}