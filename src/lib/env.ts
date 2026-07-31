import { z } from "zod";

/**
 * Validação das variáveis de ambiente no boot.
 *
 * Sem isto, uma variável ausente não impede o deploy — ela degrada o
 * comportamento em produção sem sinal claro: sem Upstash a captação de leads
 * passa a responder 503, sem `RESEND_API_KEY` os e-mails somem silenciosamente.
 * Aqui a falta vira erro de inicialização, que aparece no deploy.
 */

/**
 * Durante `next build` o Next define `NODE_ENV=production` e coleta os dados das
 * páginas, mas os segredos de runtime podem ainda não estar injetados. Exigi-los
 * aqui reprovaria a compilação por um motivo que não é erro de configuração.
 * A validação estrita fica para o boot do servidor.
 */
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

const isProduction = process.env.NODE_ENV === "production" && !isBuildPhase;

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Banco — obrigatório sempre que a aplicação de fato roda.
  DATABASE_URL: isBuildPhase
    ? z.string().optional()
    : z.string().url("DATABASE_URL deve ser uma URL válida"),
  DIRECT_URL: z.string().url().optional(),

  // Auth — o segredo é exigido apenas em produção; em dev o Auth.js gera um.
  AUTH_SECRET: isProduction
    ? z.string().min(32, "AUTH_SECRET deve ter ao menos 32 caracteres")
    : z.string().min(1).optional(),
  AUTH_URL: z.string().url().optional(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),

  // E-mail transacional.
  RESEND_API_KEY: isProduction
    ? z.string().min(1, "RESEND_API_KEY é obrigatória em produção")
    : z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  LEAD_NOTIFY_EMAIL: z.string().email().optional(),

  // Rate limiting — sem isto o endpoint público falha fechado (503).
  UPSTASH_REDIS_REST_URL: isProduction
    ? z.string().url("UPSTASH_REDIS_REST_URL é obrigatória em produção")
    : z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: isProduction
    ? z.string().min(1, "UPSTASH_REDIS_REST_TOKEN é obrigatória em produção")
    : z.string().optional(),

  // Público.
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().optional(),

  // Ecossistema.
  PILI_STORE_URL: z.string().url().optional(),
  PILI_TECH_URL: z.string().url().optional(),
  PILI_RASTE_URL: z.string().url().optional(),
  PILI_HARBOR_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof schema>;

function parseEnv(): Env {
  const parsed = schema.safeParse(process.env);

  if (!parsed.success) {
    const detalhes = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `Variáveis de ambiente inválidas ou ausentes:\n${detalhes}\n\n` +
        `Consulte .env.example para a lista completa.`,
    );
  }

  return parsed.data;
}

export const env = parseEnv();
