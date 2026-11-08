// app/api/orders/route.ts
import { db } from '@/lib/db';
import { calcShipping, createOrderId } from '@/lib/orders';
import type { Order } from '@/lib/orders';
import { fieldErrors, getClientIp, json, readJson } from '@/server/http';
import { rateLimit } from '@/server/rateLimit';
import { normalizePhone, orderSchema } from '@/server/schemas';

class StockError extends Error {}

const UNAVAILABLE_MESSAGE =
  'Some items in your bag are no longer available. Please clear your bag and add them again.';

export async function POST(request: Request) {
  const limit = rateLimit(`orders:${getClientIp(request)}`, 10, 10 * 60 * 1000);
  if (!limit.ok) {
    return json(
      { code: 'rate_limited', error: 'Too many orders. Please wait a few minutes and try again.' },
      429,
      { 'Retry-After': String(limit.retryAfter) },
    );
  }

  const parsed = orderSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return json(
      { code: 'validation', error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error) },
      400,
    );
  }
  const input = parsed.data;

  // Merge duplicate lines, then load the REAL products from the database
  const quantities = new Map<string, number>();
  for (const item of input.items) {
    quantities.set(item.productId, Math.min((quantities.get(item.productId) ?? 0) + item.quantity, 99));
  }

  const products = await db.product.findMany({
    where: { id: { in: [...quantities.keys()] }, isActive: true },
    select: { id: true, name: true, price: true, image: true, stock: true },
  });
  const byId = new Map(products.map((product) => [product.id, product]));

  const lines: { productId: string; name: string; price: number; image: string; quantity: number; stock: number }[] = [];
  for (const [productId, quantity] of quantities) {
    const product = byId.get(productId);
    if (!product) return json({ code: 'unavailable', error: UNAVAILABLE_MESSAGE }, 409);
    lines.push({ productId, name: product.name, price: product.price, image: product.image, quantity, stock: product.stock });
  }

  const short = lines.find((line) => line.quantity > line.stock);
  if (short) {
    return json(
      {
        code: 'out_of_stock',
        error: short.stock === 0 ? `${short.name} is out of stock.` : `Only ${short.stock} left of ${short.name}.`,
      },
      409,
    );
  }

  // Totals are calculated here, from database prices
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const shipping = calcShipping(subtotal);
  const total = subtotal + shipping;
  const email = input.customer.email.toLowerCase();

  try {
    // One all-or-nothing step: take the stock off, then save the order.
    // If anyone bought the last item a moment ago, this rolls back.
    const created = await db.$transaction(async (tx) => {
      for (const line of lines) {
        const result = await tx.product.updateMany({
          where: { id: line.productId, stock: { gte: line.quantity } },
          data: { stock: { decrement: line.quantity } },
        });
        if (result.count !== 1) throw new StockError(line.name);
      }

      return tx.order.create({
        data: {
          number: createOrderId(),
          status: 'pending',
          paymentMethod: input.paymentMethod,
          paymentStatus: 'unpaid',
          subtotal,
          shipping,
          total,
          fullName: input.customer.fullName,
          phone: normalizePhone(input.customer.phone),
          email: email || null,
          city: input.address.city,
          address: input.address.details,
          notes: input.address.notes || null,
          items: {
            create: lines.map((line) => ({
              productId: line.productId,
              name: line.name,
              price: line.price,
              image: line.image,
              quantity: line.quantity,
            })),
          },
        },
        include: { items: true },
      });
    });

    // Same shape the confirmation page and account page already use
    const order: Order = {
      id: created.number,
      placedAt: created.createdAt.toISOString(),
      items: created.items.map((item) => ({
        id: item.productId ?? item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal: created.subtotal,
      shipping: created.shipping,
      total: created.total,
      customer: { fullName: created.fullName, phone: created.phone, email: created.email ?? '' },
      address: { city: created.city, details: created.address, notes: created.notes ?? '' },
      paymentMethod: input.paymentMethod,
    };

    return json({ order }, 201);
  } catch (error) {
    if (error instanceof StockError) {
      return json(
        { code: 'out_of_stock', error: `${error.message} just sold out. Please update your bag.` },
        409,
      );
    }
    console.error('Order failed', error);
    return json({ code: 'server', error: 'We could not place your order. Please try again.' }, 500);
  }
}