import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('\nRow counts');
  console.table({
    Category: await prisma.category.count(),
    Product: await prisma.product.count(),
    Article: await prisma.article.count(),
    Testimonial: await prisma.testimonial.count(),
    Order: await prisma.order.count(),
    OrderItem: await prisma.orderItem.count(),
    Subscriber: await prisma.subscriber.count(),
    ContactMessage: await prisma.contactMessage.count(),
  });

  console.log('\nProducts per category');
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { name: true, _count: { select: { products: true } } },
  });
  console.table(categories.map((c) => ({ category: c.name, products: c._count.products })));

  console.log('\nProducts (id and stock)');
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, price: true, stock: true },
  });
  console.table(products);

  console.log('\nOrders');
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'asc' },
    select: { number: true, status: true, paymentMethod: true, total: true },
  });
  console.table(orders);
}

main()
  .catch((error) => {
    console.error('Error executing database check script:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });