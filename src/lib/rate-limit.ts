import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/** `undefined` = ainda não inicializado; `null` = Upstash não configurado. */
let rateLimiter: Ratelimit | null | undefined;

function createRateLimiter(): Ratelimit | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }

  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
    prefix: "pili:ratelimit",
  });
}

function getRateLimiter() {
  if (rateLimiter === undefined) {
    rateLimiter = createRateLimiter();
  }
  return rateLimiter;
}

export type RateLimitResult = {
  success: boolean;
  /** `unconfigured` distingue "excedeu o limite" de "não dá para limitar". */
  reason?: "limit" | "unconfigured";
};

/**
 * Em produção sem Upstash configurado a requisição é recusada: deixar o
 * endpoint aberto silenciosamente é pior do que devolver erro. Em
 * desenvolvimento o limite é dispensado para não exigir Redis local.
 */
export async function checkRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  const limiter = getRateLimiter();

  if (!limiter) {
    if (process.env.NODE_ENV === "production") {
      return { success: false, reason: "unconfigured" };
    }
    return { success: true };
  }

  const { success } = await limiter.limit(identifier);
  return success ? { success: true } : { success: false, reason: "limit" };
}

/**
 * IP do cliente a partir dos cabeçalhos do proxy. Assume que a plataforma
 * (Vercel) sobrescreve estes cabeçalhos — sem um proxy confiável à frente eles
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
