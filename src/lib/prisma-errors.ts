import { Prisma } from "@prisma/client";
import { logger } from "./logger";

/** Violação de constraint única. */
export function isUniqueConstraintError(err: unknown) {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002"
  );
}

/**
 * Log de erro no servidor. As actions devolvem mensagens genéricas ao cliente;
 * sem isto as falhas ficariam invisíveis em produção.
 *
 * Delega ao logger estruturado (`lib/logger.ts`), que redige campos sensíveis
 * e emite JSON indexável pela plataforma.
 */
export function logError(scope: string, error: unknown) {
  logger.error("Falha em operação de servidor", { scope, error });
}
