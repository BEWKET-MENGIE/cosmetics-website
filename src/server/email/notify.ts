// src/server/email/notify.ts
import type { Order } from '@/lib/orders';
import { sendEmail } from '@/server/email/send';
import {
  contactAutoReplyEmail,
  contactNotificationEmail,
  newsletterWelcomeEmail,
  orderReceivedEmail,
  orderStatusEmail,
  passwordResetEmail,
  paymentReceivedEmail,
  storeOrderAlertEmail,
  verifyEmailEmail,
  type OrderStatusKind, // Import the exact type from templates
} from '@/server/email/templates';
import { unsubscribeUrl } from '@/server/email/tokens';

// Each function is one "event". Call them through sendInBackground() so nobody waits.

const storeInbox = () => process.env.STORE_EMAIL;

export async function notifyOrderPlaced(order: Order) {
  if (order.customer.email) {
    await sendEmail({
      to: order.customer.email,
      ...orderReceivedEmail(order),
      idempotencyKey: `order-received/${order.id}`,
    });
  }
  const store = storeInbox();
  if (store) {
    await sendEmail({ to: store, ...storeOrderAlertEmail(order), idempotencyKey: `order-alert/${order.id}` });
  }
}

export async function notifyPaymentReceived(order: Order) {
  if (!order.customer.email) return;
  await sendEmail({
    to: order.customer.email,
    ...paymentReceivedEmail(order),
    idempotencyKey: `payment-received/${order.id}`,
  });
}

export async function notifyContact(data: { name: string; email: string; subject: string; message: string }) {
  const store = storeInbox();
  if (store) {
    // Reply-To is the customer, so answering the email goes straight to them
    await sendEmail({ to: store, replyTo: data.email, ...contactNotificationEmail(data) });
  }
  await sendEmail({ to: data.email, ...contactAutoReplyEmail(data) });
}

export async function notifyWelcome(email: string) {
  const url = unsubscribeUrl(email);
  await sendEmail({
    to: email,
    ...newsletterWelcomeEmail(url),
    headers: { 'List-Unsubscribe': `<${url}>` },
  });
}

export async function notifyPasswordReset(user: { name: string; email: string }, url: string) {
  await sendEmail({ to: user.email, ...passwordResetEmail(user.name, url) });
}

export async function notifyVerifyEmail(user: { name: string; email: string }, url: string) {
  await sendEmail({ to: user.email, ...verifyEmailEmail(user.name, url) });
}

export async function notifyOrderStatus(order: Order, kind: OrderStatusKind) {
  if (!order.customer.email) return;
  await sendEmail({
    to: order.customer.email,
    ...orderStatusEmail(order, kind),
    idempotencyKey: `order-${kind}/${order.id}`,
  });
}