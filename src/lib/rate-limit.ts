import { db } from "./db";
import { logError } from "./prisma-errors";

/**
 * Rate limiting de janela fixa, apoiado no Postgres.
 *
 * O contador precisa ser compartilhado entre instâncias e sobreviver a
 * redeploys — memória do processo não serve. Antes isso dependia de um Redis
 * externo (Upstash); o volume do site não justifica outro serviço, e o banco
 * já está aqui.
 */

export type RateLimitResult = {
  success: boolean;
  /** Requisições restantes na janela atual. */
  remaining: number;
  /** Instante em que a janela expira. */
  resetAt: Date;
};

interface LimitOptions {
  /** Chave do balde. Prefixe por finalidade: `leads:`, `login:email:`. */
  key: string;
  /** Máximo de requisições permitidas na janela. */
  limit: number;
  /** Duração da janela em segundos. */
  windowSeconds: number;
}

/**
 * Incrementa o contador e devolve o estado da janela.
 *
 * Tudo acontece num único `INSERT ... ON CONFLICT DO UPDATE`, que o Postgres
 * executa atomicamente: duas requisições simultâneas na mesma chave não perdem
 * contagem nem sobrescrevem uma à outra.
 */
export async function consumeRateLimit({
  key,
  limit,
  windowSeconds,
}: LimitOptions): Promise<RateLimitResult> {
  const rows = await db.$queryRaw<{ count: number; expiresAt: Date }[]>`
    INSERT INTO "RateLimit" ("key", "count", "expiresAt")
    VALUES (${key}, 1, now() + make_interval(secs => ${windowSeconds}))
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "RateLimit"."expiresAt" < now() THEN 1
        ELSE "RateLimit"."count" + 1
      END,
      "expiresAt" = CASE
        WHEN "RateLimit"."expiresAt" < now() THEN EXCLUDED."expiresAt"
        ELSE "RateLimit"."expiresAt"
      END
    RETURNING "count", "expiresAt"
  `;

  const row = rows[0];
  if (!row) {
    // Não deve acontecer: o RETURNING sempre traz uma linha.
    return { success: true, remaining: limit, resetAt: new Date() };
  }

  return {
    success: row.count <= limit,
    remaining: Math.max(0, limit - row.count),
    resetAt: row.expiresAt,
  };
}

/** Zera o contador de uma chave — usado após um login bem-sucedido. */
export async function resetRateLimit(key: string): Promise<void> {
  try {
    await db.$executeRaw`DELETE FROM "RateLimit" WHERE "key" = ${key}`;
  } catch (err) {
    logError("RATE_LIMIT_RESET", err);
  }
}

/**
 * Remove janelas vencidas. Chamado de forma oportunista, com baixa
 * probabilidade, para a tabela não crescer sem limite — não vale um cron.
 */
export async function pruneRateLimits(): Promise<void> {
  try {
    await db.$executeRaw`DELETE FROM "RateLimit" WHERE "expiresAt" < now() - interval '1 hour'`;
  } catch (err) {
    logError("RATE_LIMIT_PRUNE", err);
  }
}

/* ---------- limite do endpoint público de leads ---------- */

const LEADS_LIMIT = 5;
const LEADS_WINDOW_SECONDS = 60;

export async function checkRateLimit(
  identifier: string,
): Promise<{ success: boolean; reason?: "limit" }> {
  // ~2% das chamadas fazem a limpeza; suficiente para conter o crescimento.
  if (Math.random() < 0.02) void pruneRateLimits();

  const result = await consumeRateLimit({
    key: `leads:${identifier}`,
    limit: LEADS_LIMIT,
    windowSeconds: LEADS_WINDOW_SECONDS,
  });

  return result.success ? { success: true } : { success: false, reason: "limit" };
}

/**
 * IP do cliente a partir dos cabeçalhos do proxy. Assume que a plataforma
 * (Railway) sobrescreve estes cabeçalhos — sem um proxy confiável à frente eles
 * são controlados pelo cliente. Só o primeiro valor de `x-forwarded-for`
 * corresponde ao cliente; o resto é a cadeia de proxies.
 */
export function getClientIp(request: Request): string | null {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || null;
}
