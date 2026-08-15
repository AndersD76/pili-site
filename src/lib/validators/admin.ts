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

/* ---------- configurações do site ---------- */

const urlOpcional = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || /^https?:\/\//.test(v), {
    message: "Informe uma URL completa, começando com https://",
  });

export const siteSettingsSchema = z.object({
  razaoSocial: z.string().trim().min(1, "Razão social obrigatória").max(200),
  cnpj: z.string().trim().min(1, "CNPJ obrigatório").max(20),
  endereco: z.string().trim().min(1, "Endereço obrigatório").max(200),
  telefone: z.string().trim().min(1, "Telefone obrigatório").max(30),
  whatsapp: z.string().trim().min(1, "WhatsApp obrigatório").max(30),
  email: z.string().trim().email("E-mail inválido"),
  emailComercial: z.string().trim().email("E-mail comercial inválido"),
  fundacao: z.coerce
    .number()
    .int()
    .min(1900, "Ano inválido")
    .max(new Date().getFullYear(), "Ano inválido"),
  instagram: urlOpcional,
  linkedin: urlOpcional,
  facebook: urlOpcional,
  youtube: urlOpcional,
  piliTechUrl: urlOpcional,
  mapaLat: z
    .string()
    .trim()
    .refine((v) => v === "" || (!isNaN(Number(v)) && Math.abs(Number(v)) <= 90), {
      message: "Latitude inválida (entre -90 e 90)",
    }),
  mapaLng: z
    .string()
    .trim()
    .refine((v) => v === "" || (!isNaN(Number(v)) && Math.abs(Number(v)) <= 180), {
      message: "Longitude inválida (entre -180 e 180)",
    }),
  mapaZoom: z.coerce.number().int().min(1, "Zoom entre 1 e 19").max(19, "Zoom entre 1 e 19"),
  statsEquipamentos: z
    .string()
    .trim()
    .min(1, "Informe os equipamentos instalados")
    .max(20),
  statsPaises: z.coerce
    .number()
    .int()
    .min(1, "Informe ao menos 1 país")
    .max(300, "Número de países inválido"),
  statsCapacidade: z.string().trim().min(1, "Informe a capacidade máxima").max(20),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

/* ---------- hero slides ---------- */

export const heroSlideSchema = z.object({
  tituloPt: z.string().trim().min(1, "Título em português obrigatório").max(120),
  subtituloPt: z.string().trim().max(240),
  tituloEs: z.string().trim().max(120),
  subtituloEs: z.string().trim().max(240),
  ordem: z.coerce.number().int().min(0).max(999),
  ativo: z.boolean(),
});

export type HeroSlideInput = z.infer<typeof heroSlideSchema>;

/* ---------- filiais ---------- */

function coordenada(limite: number, nome: string) {
  return z
    .string()
    .trim()
    .refine((v) => v === "" || (!isNaN(Number(v)) && Math.abs(Number(v)) <= limite), {
      message: `${nome} inválida (entre -${limite} e ${limite})`,
    });
}

export const filialSchema = z
  .object({
    nome: z.string().trim().min(1, "Nome obrigatório").max(120),
    tipo: z.enum(["FILIAL", "ESCRITORIO", "ASSISTENCIA"]),
    cidade: z.string().trim().min(1, "Cidade obrigatória").max(120),
    uf: z
      .string()
      .trim()
      .length(2, "UF deve ter 2 letras")
      .regex(/^[A-Za-z]{2}$/, "UF deve conter apenas letras"),
    endereco: z.string().trim().min(1, "Endereço obrigatório").max(240),
    cep: z
      .string()
      .trim()
      .refine((v) => v === "" || /^\d{5}-?\d{3}$/.test(v), {
        message: "CEP inválido (use 00000-000)",
      }),
    telefone: z.string().trim().max(30),
    lat: coordenada(90, "Latitude"),
    lng: coordenada(180, "Longitude"),
    ordem: z.coerce.number().int().min(0).max(999),
    ativa: z.boolean(),
  })
  .refine((d) => (d.lat === "") === (d.lng === ""), {
    message: "Preencha latitude e longitude juntas, ou deixe as duas em branco",
    path: ["lng"],
  });

export type FilialInput = z.infer<typeof filialSchema>;

/* ---------- marcos da trajetória ---------- */

export const marcoSchema = z.object({
  ano: z.string().trim().max(12),
  tituloPt: z.string().trim().min(1, "Título em português obrigatório").max(80),
  textoPt: z.string().trim().min(1, "Texto em português obrigatório").max(600),
  tituloEs: z.string().trim().max(80),
  textoEs: z.string().trim().max(600),
  ordem: z.coerce.number().int().min(0).max(999),
  ativo: z.boolean(),
});

export type MarcoInput = z.infer<typeof marcoSchema>;

/* ---------- blocos de seção ---------- */

export const blocoSchema = z.object({
  tituloPt: z.string().trim().max(80),
  subtituloPt: z.string().trim().max(120),
  textoPt: z.string().trim().max(800),
  tituloEs: z.string().trim().max(80),
  subtituloEs: z.string().trim().max(120),
  textoEs: z.string().trim().max(800),
});

export type BlocoInput = z.infer<typeof blocoSchema>;

/* ---------- setores ---------- */

export const setorSchema = z.object({
  tituloPt: z.string().trim().max(60),
  descricaoPt: z.string().trim().max(200),
  headlinePt: z.string().trim().max(120),
  descricaoLongaPt: z.string().trim().max(600),
  tituloEs: z.string().trim().max(60),
  descricaoEs: z.string().trim().max(200),
  headlineEs: z.string().trim().max(120),
  descricaoLongaEs: z.string().trim().max(600),
  ordem: z.coerce.number().int().min(0).max(99),
  ativo: z.boolean(),
});

export type SetorInput = z.infer<typeof setorSchema>;

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
