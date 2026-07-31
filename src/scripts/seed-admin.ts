import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const BCRYPT_ROUNDS = 12;

/**
 * Lê uma variável obrigatória. Credenciais nunca são embutidas no código: este
 * script faz `upsert`, então uma senha fixa aqui sobrescreveria a senha real do
 * admin se rodasse contra produção.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variável de ambiente ${name} é obrigatória para rodar o seed de usuários.`,
    );
  }
  return value;
}

async function main() {
  if (process.env.NODE_ENV === "production" && !process.env.ALLOW_PROD_SEED) {
    throw new Error(
      "Recusando rodar o seed em produção. Defina ALLOW_PROD_SEED=1 se for intencional.",
    );
  }

  const adminEmail = requireEnv("SEED_ADMIN_EMAIL");
  const adminPassword = requireEnv("SEED_ADMIN_PASSWORD");
  const clientEmail = process.env.SEED_CLIENT_EMAIL;
  const clientPassword = process.env.SEED_CLIENT_PASSWORD;

  const adminHash = bcrypt.hashSync(adminPassword, BCRYPT_ROUNDS);

  await db.user.upsert({
    where: { email: adminEmail.toLowerCase().trim() },
    update: { passwordHash: adminHash, role: "ADMIN" },
    create: {
      email: adminEmail.toLowerCase().trim(),
      name: process.env.SEED_ADMIN_NAME ?? "Administrador PILI",
      passwordHash: adminHash,
      role: "ADMIN",
      company: "PILI Industrial",
    },
  });

  console.log(`[OK] Admin: ${adminEmail}`);

  if (clientEmail && clientPassword) {
    const clientHash = bcrypt.hashSync(clientPassword, BCRYPT_ROUNDS);

    await db.user.upsert({
      where: { email: clientEmail.toLowerCase().trim() },
      update: { passwordHash: clientHash, role: "CLIENTE" },
      create: {
        email: clientEmail.toLowerCase().trim(),
        name: process.env.SEED_CLIENT_NAME ?? "Cliente demonstração",
        passwordHash: clientHash,
        role: "CLIENTE",
        company: "Cooperativa Central Agricola",
        phone: "+55 54 99876-5432",
      },
    });

    console.log(`[OK] Cliente: ${clientEmail}`);
  } else {
    console.log(
      "[--] Cliente de demonstração ignorado (defina SEED_CLIENT_EMAIL e SEED_CLIENT_PASSWORD).",
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
