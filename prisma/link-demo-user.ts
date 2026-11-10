// prisma/link-demo-user.ts
import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../src/generated/prisma/client';

const ORDER_NUMBERS = ['LUM-1001', 'LUM-1002', 'LUM-1003'];
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

// Target email: pass as CLI argument or default to your login email
const EMAIL = process.argv[2] ?? 'mengiebewket@gmail.com';

async function main() {
  const user = await prisma.user.findUnique({ where: { email: EMAIL } });
  if (!user) throw new Error(`No account found for ${EMAIL}. Create it first on the sign-up/account page.`);

  // Mark the account as verified
  await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });

  const result = await prisma.order.updateMany({
    where: { number: { in: ORDER_NUMBERS } },
    data: { userId: user.id },
  });
  
  console.log(`✅ Successfully verified email for ${EMAIL} and linked ${result.count} orders.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());