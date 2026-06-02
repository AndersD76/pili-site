import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const passwordHash = bcrypt.hashSync("pili2025", 10);

  await db.user.upsert({
    where: { email: "admin@pili.ind.br" },
    update: { passwordHash, role: "ADMIN" },
    create: {
      email: "admin@pili.ind.br",
      name: "Administrador PILI",
      passwordHash,
      role: "ADMIN",
      company: "PILI Industrial",
    },
  });

  await db.user.upsert({
    where: { email: "cliente@pili.ind.br" },
    update: {
      passwordHash: bcrypt.hashSync("cliente2025", 10),
      role: "CLIENTE",
    },
    create: {
      email: "cliente@pili.ind.br",
      name: "Roberto Mendes",
      passwordHash: bcrypt.hashSync("cliente2025", 10),
      role: "CLIENTE",
      company: "Cooperativa Central Agricola",
      phone: "+55 54 99876-5432",
    },
  });

  console.log("Admin and demo client users created/updated successfully!");
  console.log("Admin: admin@pili.ind.br / pili2025");
  console.log("Client: cliente@pili.ind.br / cliente2025");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
