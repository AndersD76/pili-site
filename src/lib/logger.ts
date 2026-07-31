/**
 * Log estruturado do servidor.
 *
 * `console.error` cru não tinha nível, correlação nem destino: dois erros
 * simultâneos de usuários diferentes eram indistinguíveis, e em produção as
 * linhas iam para os logs de função sem alerta nenhum. Emitir JSON numa linha
 * permite que a plataforma (Vercel, Datadog, Sentry) indexe os campos.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogFields {
  /** Escopo curto e estável, ex.: `LEADS_EXPORT`. */
  scope: string;
  /** Identificador da requisição, quando disponível. */
  requestId?: string;
  userId?: string;
  [key: string]: unknown;
}

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

/** Em produção, `debug` é descartado. */
const MIN_LEVEL: LogLevel =
  process.env.NODE_ENV === "production" ? "info" : "debug";

/** Campos cujo valor nunca deve ir para o log. */
const SENSITIVE = new Set([
  "password",
  "passwordHash",
  "token",
  "authorization",
  "cookie",
  "email",
  "phone",
  "cpfCnpj",
  "cnpj",
]);

function scrub(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(scrub);

  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    out[k] = SENSITIVE.has(k) ? "[redigido]" : scrub(v);
  }
  return out;
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    };
  }
  return { message: String(error) };
}

function emit(level: LogLevel, message: string, fields: LogFields) {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[MIN_LEVEL]) return;

  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(scrub(fields) as Record<string, unknown>),
  };

  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (message: string, fields: LogFields) => emit("debug", message, fields),
  info: (message: string, fields: LogFields) => emit("info", message, fields),
  warn: (message: string, fields: LogFields) => emit("warn", message, fields),
  error: (message: string, fields: LogFields & { error?: unknown }) =>
    emit("error", message, {
      ...fields,
      error: fields.error ? serializeError(fields.error) : undefined,
    }),
};
