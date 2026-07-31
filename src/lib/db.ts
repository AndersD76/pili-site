import { PrismaClient } from "@prisma/client";
// Importar aqui garante que a validação de ambiente rode antes de qualquer
// acesso a dados — `db` é a primeira dependência de todo caminho de servidor.
import "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
