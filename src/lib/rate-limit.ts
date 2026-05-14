import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function createRateLimiter() {
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

let rateLimiter: Ratelimit | null;

export function getRateLimiter() {
  if (rateLimiter === undefined) {
    rateLimiter = createRateLimiter();
  }
  return rateLimiter;
}

export async function checkRateLimit(identifier: string) {
  const limiter = getRateLimiter();
  if (!limiter) return { success: true, remaining: 999 };
  return limiter.limit(identifier);
}
