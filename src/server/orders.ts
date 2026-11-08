// src/server/orders.ts
import { PAYMENT_METHODS } from '@/lib/orders';
import type { Order, PaymentMethod } from '@/lib/orders';

interface OrderRow {
  number: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: Date;
  subtotal: number;
  shipping: number;
  total: number;
  fullName: string;
  phone: string;
  email: string | null;
  city: string;
  address: string;
  notes: string | null;
  items: { id: string; productId: string | null; name: string; price: number; quantity: number; image: string }[];
}

const isPaymentMethod = (value: string): value is PaymentMethod =>
  PAYMENT_METHODS.some((method) => method.value === value);

export function toClientOrder(row: OrderRow): Order {
  return {
    id: row.number,
    placedAt: row.createdAt.toISOString(),
    status: row.status,
    paymentStatus: row.paymentStatus,
    items: row.items.map((item) => ({
      id: item.productId ?? item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
    subtotal: row.subtotal,
    shipping: row.shipping,
    total: row.total,
    customer: { fullName: row.fullName, phone: row.phone, email: row.email ?? '' },
    address: { city: row.city, details: row.address, notes: row.notes ?? '' },
    paymentMethod: isPaymentMethod(row.paymentMethod) ? row.paymentMethod : 'cod',
  };
}