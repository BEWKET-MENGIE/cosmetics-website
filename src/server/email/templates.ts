// src/server/email/templates.ts
import { formatDate } from '@/lib/date';
import { PAYMENT_METHODS } from '@/lib/orders';
import type { Order } from '@/lib/orders';
import { SITE, SITE_URL } from '@/lib/site';

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Removes line breaks so user text can never add extra email headers. */
export const oneLine = (value: string) => value.replace(/[\r\n]+/g, ' ').trim();

const money = (amount: number) => `${amount.toLocaleString('en-US')} ETB`;

// ------------------------------------------------------------- building blocks
const h1 = (text: string) =>
  `<h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;color:#0f172a">${escapeHtml(text)}</h1>`;

const p = (html: string) => `<p style="margin:0 0 16px;font-size:15px;line-height:1.7">${html}</p>`;

const button = (url: string, label: string) =>
  `<p style="margin:24px 0"><a href="${escapeHtml(url)}" style="display:inline-block;background:#f43f5e;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:13px 26px;border-radius:999px">${escapeHtml(label)}</a></p>`;

const linkFallback = (url: string) =>
  p(
    `If the button does not work, copy this link into your browser:<br><a href="${escapeHtml(url)}" style="color:#e11d48;word-break:break-all">${escapeHtml(url)}</a>`,
  );

function shell(preheader: string, body: string, footer?: string): string {
  const defaultFooter = `Questions? Just reply to this email or write to ${escapeHtml(SITE.contact.email)}.<br>&copy; ${escapeHtml(SITE.name)} Cosmetics`;
  return `<!doctype html>
<html lang="en"><body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#334155">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#0a0a0a;padding:20px 28px;color:#34d399;font-size:20px;font-weight:bold;letter-spacing:1px">${escapeHtml(SITE.name)}</td></tr>
<tr><td style="padding:28px">${body}</td></tr>
<tr><td style="padding:16px 28px;background:#f8fafc;color:#64748b;font-size:12px;line-height:1.7">${footer ?? defaultFooter}</td></tr>
</table></td></tr></table></body></html>`;
}

// --------------------------------------------------------------- order pieces
function orderTable(order: Order): string {
  const cell = 'padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:14px';
  const rows = order.items
    .map(
      (item) =>
        `<tr><td style="${cell}">${escapeHtml(item.name)} <span style="color:#64748b">&times; ${item.quantity}</span></td><td align="right" style="${cell}">${money(item.price * item.quantity)}</td></tr>`,
    )
    .join('');
  const line = (label: string, value: string, strong = false) =>
    `<tr><td style="padding:6px 0;font-size:14px;${strong ? 'font-weight:bold;color:#0f172a' : ''}">${label}</td><td align="right" style="padding:6px 0;font-size:14px;${strong ? 'font-weight:bold;color:#0f172a' : ''}">${value}</td></tr>`;

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px">${rows}${line('Subtotal', money(order.subtotal))}${line('Shipping', order.shipping === 0 ? 'Free' : money(order.shipping))}${line('Total', money(order.total), true)}</table>`;
}

function orderText(order: Order): string {
  const lines = order.items.map((i) => `- ${i.name} x ${i.quantity}: ${money(i.price * i.quantity)}`);
  return [
    ...lines,
    `Subtotal: ${money(order.subtotal)}`,
    `Shipping: ${order.shipping === 0 ? 'Free' : money(order.shipping)}`,
    `Total: ${money(order.total)}`,
  ].join('\n');
}

const paymentLabel = (order: Order) =>
  PAYMENT_METHODS.find((method) => method.value === order.paymentMethod)?.label ?? order.paymentMethod;

const returnUrl = (order: Order) => `${SITE_URL}/checkout/return?ref=${encodeURIComponent(order.id)}`;

// ----------------------------------------------------------------- templates
export function orderReceivedEmail(order: Order): EmailContent {
  const online = order.paymentMethod === 'chapa';
  const paid = order.paymentStatus === 'paid';
  const paymentNote = paid
    ? 'We have received your payment. Thank you!'
    : online
      ? 'Your payment is still pending. Please complete it so we can process your order.'
      : 'You will pay in cash when your order arrives.';

  const body =
    h1('Thank you for your order!') +
    p(`Hi ${escapeHtml(order.customer.fullName)}, we have received order <strong>${escapeHtml(order.id)}</strong> on ${formatDate(order.placedAt)}.`) +
    orderTable(order) +
    p(`<strong>Delivery to:</strong> ${escapeHtml(order.address.details)}, ${escapeHtml(order.address.city)}<br><strong>Payment:</strong> ${escapeHtml(paymentLabel(order))}`) +
    p(escapeHtml(paymentNote)) +
    (online && !paid ? button(returnUrl(order), 'Complete your payment') : '') +
    p('We will contact you on the phone number you gave us to confirm delivery.');

  const text = [
    `Thank you for your order, ${order.customer.fullName}!`,
    `Order ${order.id} (${formatDate(order.placedAt)})`,
    '',
    orderText(order),
    '',
    `Delivery to: ${order.address.details}, ${order.address.city}`,
    `Payment: ${paymentLabel(order)}`,
    paymentNote,
    online && !paid ? `Complete your payment: ${returnUrl(order)}` : '',
  ]
    .filter((line, index, all) => line !== '' || all[index - 1] !== '')
    .join('\n');

  return {
    subject: `Your ${SITE.name} order ${order.id}`,
    html: shell(`Order ${order.id} received`, body),
    text,
  };
}

export function paymentReceivedEmail(order: Order): EmailContent {
  const body =
    h1('Payment received') +
    p(`Hi ${escapeHtml(order.customer.fullName)}, we have received your payment of <strong>${money(order.total)}</strong> for order <strong>${escapeHtml(order.id)}</strong>. We are preparing it now.`) +
    orderTable(order);

  return {
    subject: `Payment received for order ${order.id}`,
    html: shell(`We received ${money(order.total)}`, body),
    text: `Hi ${order.customer.fullName},\n\nWe have received your payment of ${money(order.total)} for order ${order.id}. We are preparing it now.\n\n${orderText(order)}`,
  };
}

export function storeOrderAlertEmail(order: Order): EmailContent {
  const body =
    h1(`New order ${order.id}`) +
    orderTable(order) +
    p(
      `<strong>Customer:</strong> ${escapeHtml(order.customer.fullName)}<br><strong>Phone:</strong> ${escapeHtml(order.customer.phone)}<br><strong>Email:</strong> ${escapeHtml(order.customer.email || 'none')}<br><strong>Address:</strong> ${escapeHtml(order.address.details)}, ${escapeHtml(order.address.city)}<br><strong>Notes:</strong> ${escapeHtml(order.address.notes || 'none')}<br><strong>Payment:</strong> ${escapeHtml(paymentLabel(order))} (${escapeHtml(order.paymentStatus ?? 'unpaid')})`,
    );

  return {
    subject: `New order ${order.id}: ${money(order.total)}`,
    html: shell('A customer placed an order', body, 'Sent to the store inbox.'),
    text: `New order ${order.id}\n\n${orderText(order)}\n\nCustomer: ${order.customer.fullName}\nPhone: ${order.customer.phone}\nEmail: ${order.customer.email || 'none'}\nAddress: ${order.address.details}, ${order.address.city}\nNotes: ${order.address.notes || 'none'}\nPayment: ${paymentLabel(order)} (${order.paymentStatus ?? 'unpaid'})`,
  };
}

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function contactAutoReplyEmail(data: ContactData): EmailContent {
  const body =
    h1('We received your message') +
    p(`Hi ${escapeHtml(data.name)}, thank you for writing to us. We will reply within 2 business days.`) +
    p('<strong>Your message:</strong>') +
    `<blockquote style="margin:0 0 16px;padding:12px 16px;border-left:4px solid #fb7185;background:#fff1f2;font-size:14px;line-height:1.7;white-space:pre-wrap">${escapeHtml(data.message)}</blockquote>`;

  return {
    subject: `We received your message: ${oneLine(data.subject)}`,
    html: shell('We will reply within 2 business days', body),
    text: `Hi ${data.name},\n\nThank you for writing to us. We will reply within 2 business days.\n\nYour message:\n${data.message}`,
  };
}

export function contactNotificationEmail(data: ContactData): EmailContent {
  const body =
    h1('New contact message') +
    p(`<strong>From:</strong> ${escapeHtml(data.name)} (${escapeHtml(data.email)})<br><strong>Subject:</strong> ${escapeHtml(data.subject)}`) +
    `<blockquote style="margin:0 0 16px;padding:12px 16px;border-left:4px solid #fb7185;background:#fff1f2;font-size:14px;line-height:1.7;white-space:pre-wrap">${escapeHtml(data.message)}</blockquote>` +
    p('Reply to this email to answer the customer directly.');

  return {
    subject: `Contact: ${oneLine(data.subject)} (${oneLine(data.name)})`,
    html: shell('A customer sent a message', body, 'Sent to the store inbox.'),
    text: `From: ${data.name} (${data.email})\nSubject: ${data.subject}\n\n${data.message}`,
  };
}

export function newsletterWelcomeEmail(unsubscribeUrl: string): EmailContent {
  const body =
    h1(`Welcome to ${SITE.name}`) +
    p('Thank you for subscribing. You will get new product updates, skincare tips from our Journal and special offers.') +
    button(`${SITE_URL}/shop`, 'Browse the shop');

  const footer = `You are receiving this because you subscribed on our website. <a href="${escapeHtml(unsubscribeUrl)}" style="color:#64748b">Unsubscribe</a>`;

  return {
    subject: `Welcome to ${SITE.name}`,
    html: shell('Thank you for subscribing', body, footer),
    text: `Welcome to ${SITE.name}!\n\nThank you for subscribing. You will get product updates, skincare tips and offers.\n\nBrowse the shop: ${SITE_URL}/shop\n\nUnsubscribe: ${unsubscribeUrl}`,
  };
}

export function passwordResetEmail(name: string, url: string): EmailContent {
  const body =
    h1('Reset your password') +
    p(`Hi ${escapeHtml(name)}, we received a request to reset the password for your account. This link works once and expires soon.`) +
    button(url, 'Choose a new password') +
    linkFallback(url) +
    p('If you did not ask for this, you can safely ignore this email. Your password will not change.');

  return {
    subject: 'Reset your password',
    html: shell('Choose a new password', body),
    text: `Hi ${name},\n\nUse this link to reset your password (it works once and expires soon):\n${url}\n\nIf you did not ask for this, ignore this email.`,
  };
}

export function verifyEmailEmail(name: string, url: string): EmailContent {
  const body =
    h1('Confirm your email') +
    p(`Hi ${escapeHtml(name)}, welcome to ${escapeHtml(SITE.name)}! Please confirm your email address to finish creating your account.`) +
    button(url, 'Confirm my email') +
    linkFallback(url);

  return {
    subject: 'Confirm your email address',
    html: shell('Finish creating your account', body),
    text: `Hi ${name},\n\nWelcome to ${SITE.name}! Confirm your email to finish creating your account:\n${url}`,
  };
}

export type OrderStatusKind = 'shipped' | 'delivered' | 'cancelled';

export function orderStatusEmail(order: Order, kind: OrderStatusKind): EmailContent {
  const copy = {
    shipped: {
      subject: `Your order ${order.id} is on its way`,
      title: 'Your order is on its way',
      message: 'Good news! Your order has been shipped. Our courier will call the phone number you gave us when they arrive.',
    },
    delivered: {
      subject: `Your order ${order.id} was delivered`,
      title: 'Your order was delivered',
      message: 'Your order has been delivered. We hope you love it! If anything is not right, just reply to this email.',
    },
    cancelled: {
      subject: `Your order ${order.id} was cancelled`,
      title: 'Your order was cancelled',
      message: 'Your order has been cancelled. If you already paid, we will contact you about your refund. If you did not expect this, please reply to this email.',
    },
  }[kind];

  const body =
    h1(copy.title) +
    p(`Hi ${escapeHtml(order.customer.fullName)}, ${escapeHtml(copy.message)}`) +
    p(`<strong>Order:</strong> ${escapeHtml(order.id)}`) +
    orderTable(order);

  return {
    subject: copy.subject,
    html: shell(copy.title, body),
    text: `Hi ${order.customer.fullName},\n\n${copy.message}\n\nOrder ${order.id}\n\n${orderText(order)}`,
  };
}