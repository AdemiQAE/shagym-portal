import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ where: { role: 'ADMIN' } });
  console.log("Admin users:", users.map(u => u.email));
}
main().catch(console.error).finally(() => prisma.$disconnect());
