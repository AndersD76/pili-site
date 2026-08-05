import { z } from "zod";
import { ProductCategory } from "@prisma/client";

/* ---------- helpers ---------- */

const slug = z
  .string()
  .trim()
  .min(1, "Slug obrigatório")
  .max(120, "Slug muito longo")
  .regex(
    /^[a-z0-9-]+$/,
    "Slug deve conter apenas letras minúsculas, números e hífens",
  );

/** Primeira mensagem de erro de um ZodError, para exibir no formulário. */
export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Dados inválidos";
}

/* ---------- produto ---------- */

/** Campos de SEO por tradução — existiam no schema e nunca eram preenchidos. */
const metaTitle = z.string().trim().max(70, "Máximo de 70 caracteres").nullable();
const metaDesc = z.string().trim().max(160, "Máximo de 160 caracteres").nullable();

export const productInputSchema = z.object({
  metaTitle,
  metaDesc,
  slug,
  category: z.nativeEnum(ProductCategory, {
    errorMap: () => ({ message: "Categoria inválida" }),
  }),
  name: z.string().trim().min(1, "Nome obrigatório").max(200),
  tagline: z.string().trim().max(300).nullable(),
  description: z.string().trim().min(1, "Descrição obrigatória").max(20000),
  active: z.boolean(),
  featured: z.boolean(),
  specs: z
    .array(
      z.object({
        key: z.string().trim().min(1, "Propriedade obrigatória").max(120),
        value: z.string().trim().min(1, "Valor obrigatório").max(300),
      }),
    )
    .max(100, "Máximo de 100 especificações"),
  // Versão em espanhol. Nome vazio significa "sem tradução" — o site cai para
  // o português em vez de exibir campos pela metade.
  faqs: z
    .array(
      z.object({
        question: z.string().trim().min(1, "Pergunta obrigatória").max(300),
        answer: z.string().trim().min(1, "Resposta obrigatória").max(2000),
      }),
    )
    .max(30, "Máximo de 30 perguntas"),
  nameEs: z.string().trim().max(200),
  taglineEs: z.string().trim().max(300),
  descriptionEs: z.string().trim().max(20000),
  metaTitleEs: z.string().trim().max(70, "Máximo de 70 caracteres"),
  metaDescEs: z.string().trim().max(160, "Máximo de 160 caracteres"),
});

export type ProductInput = z.infer<typeof productInputSchema>;

/* ---------- obra / case ---------- */

const currentYear = new Date().getFullYear();

export const caseInputSchema = z.object({
  slug,
  client: z.string().trim().min(1, "Cliente obrigatório").max(200),
  location: z.string().trim().min(1, "Local obrigatório").max(200),
  year: z
    .number()
    .int("Ano inválido")
    .min(1900, "Ano inválido")
    .max(currentYear + 5, "Ano inválido"),
  title: z.string().trim().min(1, "Título obrigatório").max(300),
  summary: z.string().trim().min(1, "Resumo obrigatório").max(2000),
  content: z.string().trim().min(1, "Conteúdo obrigatório").max(50000),
  titleEs: z.string().trim().max(300),
  summaryEs: z.string().trim().max(2000),
  contentEs: z.string().trim().max(50000),
  active: z.boolean(),
  featured: z.boolean(),
  metrics: z
    .array(
      z.object({
        label: z.string().trim().min(1, "Rótulo obrigatório").max(120),
        value: z.string().trim().min(1, "Valor obrigatório").max(120),
      }),
    )
    .max(50, "Máximo de 50 métricas"),
});

export type CaseInput = z.infer<typeof caseInputSchema>;

/* ---------- post ---------- */

export const postInputSchema = z.object({
  slug,
  author: z.string().trim().min(1).max(200),
  title: z.string().trim().min(1, "Título obrigatório").max(300),
  excerpt: z.string().trim().min(1, "Resumo obrigatório").max(2000),
  content: z.string().trim().min(1, "Conteúdo obrigatório").max(100000),
  titleEs: z.string().trim().max(300),
  excerptEs: z.string().trim().max(2000),
  contentEs: z.string().trim().max(100000),
  published: z.boolean(),
  tags: z.array(z.string().trim().min(1).max(60)).max(20, "Máximo de 20 tags"),
});

export type PostInput = z.infer<typeof postInputSchema>;

/* ---------- FormData ---------- */

/** Lê um booleano serializado como "true"/"false" pelo formulário. */
export function formBool(data: FormData, key: string): boolean {
  return data.get(key) === "true";
}

/** Lê um campo de texto do FormData. */
export function formString(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value : "";
}

/**
 * Campo opcional: string vazia vira `null`.
 *
 * Usado nas traduções — deixar o campo em branco no painel significa "não
 * traduzido", e a linha correspondente é removida em vez de gravada vazia.
 */
export function vazioParaNulo(valor: string): string | null {
  const limpo = valor.trim();
  return limpo === "" ? null : limpo;
}

/**
 * Lê um array serializado como JSON. Devolve `null` quando o JSON é inválido —
 * o chamador transforma isso em erro de validação.
 */
export function formJsonArray(data: FormData, key: string): unknown[] | null {
  const raw = formString(data, key);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
