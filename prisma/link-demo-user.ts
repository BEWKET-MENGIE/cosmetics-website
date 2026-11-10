// prisma/link-demo-user.ts
import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../src/generated/prisma/client';

const ORDER_NUMBERS = ['LUM-1001', 'LUM-1002', 'LUM-1003'];
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

// Demo convenience: pretend these seeded orders belong to the demo account
const EMAIL = process.argv[2] ?? 'hanna@example.com';

async function main() {
  const user = await prisma.user.findUnique({ where: { email: EMAIL } });
  if (!user) throw new Error(`No account found for ${EMAIL}. Create it first (see the curl step).`);

  // The demo account was created before email verification existed: mark it verified
  await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });

  const result = await prisma.order.updateMany({
    where: { number: { in: ORDER_NUMBERS } },
    data: { userId: user.id },
  });
  console.log(`Linked ${result.count} orders to ${EMAIL}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());