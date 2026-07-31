import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { logError } from "./prisma-errors";

/**
 * Limitação de tentativas de login.
 *
 * A rota `/api/auth/[...nextauth]` não passa pelo limitador do endpoint público,
 * então o provider de credenciais aceitava tentativas ilimitadas contra contas
 * ADMIN. O limite é aplicado por e-mail — a chave que o atacante precisa
 * adivinhar junto com a senha — e por IP, para conter varredura de contas.
 */

const MAX_ATTEMPTS = 5;
const WINDOW = "15 m";

let limiter: Ratelimit | null | undefined;

function getLoginLimiter(): Ratelimit | null {
  if (limiter === undefined) {
    limiter =
      process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
        ? new Ratelimit({
            redis: Redis.fromEnv(),
            limiter: Ratelimit.slidingWindow(MAX_ATTEMPTS, WINDOW),
            analytics: true,
            prefix: "pili:login",
          })
        : null;
  }
  return limiter;
}

/**
 * `true` quando a tentativa pode prosseguir.
 *
 * Falha **aberta** de propósito: se o Redis estiver indisponível, bloquear todo
 * login trancaria a operação inteira para fora do painel. O risco de força bruta
 * durante uma indisponibilidade do Redis é menor que o de negar acesso a todos.
 */
export async function checkLoginAttempt(
  email: string,
  ip: string | null,
): Promise<boolean> {
  const loginLimiter = getLoginLimiter();
  if (!loginLimiter) return true;

  try {
    const results = await Promise.all([
      loginLimiter.limit(`email:${email.toLowerCase().trim()}`),
      loginLimiter.limit(`ip:${ip ?? "unknown"}`),
    ]);
    return results.every((r) => r.success);
  } catch (err) {
    logError("LOGIN_RATE_LIMIT", err);
    return true;
  }
}

/** Zera o contador do e-mail após um login bem-sucedido. */
export async function resetLoginAttempts(email: string): Promise<void> {
  const loginLimiter = getLoginLimiter();
  if (!loginLimiter) return;

  try {
    await loginLimiter.resetUsedTokens(`email:${email.toLowerCase().trim()}`);
  } catch (err) {
    logError("LOGIN_RATE_LIMIT_RESET", err);
  }
}
