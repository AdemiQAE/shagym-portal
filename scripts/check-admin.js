import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ where: { role: 'ADMIN' } });
  if (users.length === 0) {
    console.log("No admins found.");
  } else {
    console.log("Admins:", users.map(u => ({ email: u.email, id: u.id })));
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
