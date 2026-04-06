import { prisma } from "../lib/db";
async function main() {
  const users = await prisma.user.findMany({ where: { role: 'ADMIN' } });
  if (users.length === 0) {
    console.log("No admins found.");
    console.log("Creating admin...");
    await prisma.user.create({
      data: {
        email: "admin@shagym.kz",
        name: "Admin",
        password: "password",
        role: "ADMIN"
      }
    });
    console.log("Created admin@shagym.kz / password");
  } else {
    console.log("Admins:", users.map((u) => ({ email: u.email, id: u.id, name: u.name, role: u.role })));
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
