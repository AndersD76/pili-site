import { z } from "zod";
import { tipoDocumento } from "@/lib/documento";
import { telefoneBRValido, telefoneEstrangeiro } from "@/lib/telefone";

/* ---------- blocos reutilizáveis ---------- */

const name = z.string().trim().min(2, "Informe seu nome").max(120);
const email = z.string().trim().email("E-mail inválido").max(200);
/**
 * Empresa precisa ter ao menos uma letra. Um lead de 04/11/2026 trouxe um
 * telefone ("34998963866") no lugar do nome da empresa e passou.
 */
const company = z
  .string()
  .trim()
  .min(2, "Informe a empresa")
  .max(120)
  .regex(/\p{L}/u, "Informe o nome da empresa");

/**
 * Telefone é opcional: os gates de catálogo e calculadora convertem apenas com
 * e-mail. O formulário completo exige o campo pela própria interface.
 */
const phone = z
  .string()
  .trim()
  .min(8, "Telefone inválido")
  .max(20, "Telefone inválido")
  .optional();

/** Aceite explícito da política de privacidade (LGPD, Art. 8). */
const consent = z.literal(true, {
  message: "Aceite a política de privacidade",
});

/**
 * ISO 3166-1 alpha-2. `ZZ` é o código reservado pela norma para "desconhecido"
 * e é o que usamos na opção "Outro".
 */
const country = z
  .string()
  .trim()
  .length(2, "País inválido")
  .regex(/^[A-Z]{2}$/, "País inválido");

/* ---------- formulário completo de contato/orçamento ---------- */

export const leadSchema = z.object({
  name,
  email,
  phone,
  company,
  // CPF ou CNPJ, opcional. A coluna se chama `cnpj` por histórico, mas aceita
  // os dois: muito produtor rural compra como pessoa física.
  cnpj: z
    .string()
    .trim()
    .max(20)
    .optional()
    .refine((v) => !v || tipoDocumento(v) !== null, "CPF ou CNPJ inválido"),
  country,
  state: z.string().trim().max(60).optional(),
  city: z.string().trim().max(120).optional(),
  role: z.string().trim().max(120).optional(),
  application: z
    .enum([
      "porto",
      "cooperativa",
      "industria",
      "fertilizante",
      "cimento",
      "outro",
    ])
    .optional(),
  productInterest: z.string().trim().max(200).optional(),
  grainType: z.string().trim().max(120).optional(),
  truckVolume: z.coerce.number().int().min(0).optional(),
  message: z.string().trim().max(2000).optional(),
  consent,
});

export type LeadInput = z.infer<typeof leadSchema>;

/* ---------- origens ---------- */

/**
 * Espelha o enum `LeadSource` do Prisma. Declarado como literais para não
 * arrastar `@prisma/client` para o bundle do cliente; o acoplamento nas duas
 * direções é verificado em tempo de compilação em `api/leads/route.ts`.
 */
export const LEAD_SOURCES = [
  "ORGANICO",
  "PAGO",
  "REFERRAL",
  "WHATSAPP",
  "CATALOGO",
  "CALCULADORA",
  "COMPARATIVO",
  "FORMULARIO",
  "TRABALHE_CONOSCO",
] as const;

export type LeadSourceLiteral = (typeof LEAD_SOURCES)[number];

/* ---------- telefone brasileiro ---------- */

const TELEFONE_INVALIDO = "Telefone inválido — confira o DDD e o número";

/**
 * O telefone deve seguir o formato brasileiro?
 *
 * Não quando vem do site em espanhol, nem quando tem DDI de outro país. O país
 * do lead não serve para decidir: o formulário não tem seletor e manda "BR"
 * sempre, inclusive do site em espanhol — um telefone boliviano chegou assim.
 */
function precisaTelefoneBR(phone: string | undefined, pageUrl?: string): boolean {
  if (!phone) return false;
  if (telefoneEstrangeiro(phone)) return false;
  if (pageUrl && /\/es(\/|$|\?)/.test(pageUrl)) return false;
  return true;
}

/**
 * Validação do formulário no site em português. A mesma regra roda de novo no
 * servidor, em `leadRequestSchema`; aqui ela só avisa antes do envio.
 */
export const leadSchemaPtBR = leadSchema.superRefine((d, ctx) => {
  if (precisaTelefoneBR(d.phone) && !telefoneBRValido(d.phone!)) {
    ctx.addIssue({ code: "custom", path: ["phone"], message: TELEFONE_INVALIDO });
  }
});

/* ---------- corpo aceito por POST /api/leads ---------- */

/**
 * Os três campos abaixo são enviados pelo cliente e não fazem parte do
 * formulário visível — precisam ser validados no servidor em vez de gravados
 * como vieram.
 */
export const leadRequestSchema = leadSchema
  .extend({
    source: z.enum(LEAD_SOURCES).default("FORMULARIO"),
    pageUrl: z.string().url().max(2000).optional(),
    utm: z.record(z.string().max(300)).optional(),
  })
  .superRefine((d, ctx) => {
    if (precisaTelefoneBR(d.phone, d.pageUrl) && !telefoneBRValido(d.phone!)) {
      ctx.addIssue({ code: "custom", path: ["phone"], message: TELEFONE_INVALIDO });
    }
  });

export type LeadRequestInput = z.infer<typeof leadRequestSchema>;

/* ---------- formulários específicos ---------- */

/** Gate de download do catálogo — não pede telefone. */
export const catalogFormSchema = z.object({
  name,
  email,
  company,
  country,
  consent,
});

export type CatalogFormInput = z.infer<typeof catalogFormSchema>;

/** Gate do resultado da calculadora — só e-mail. */
export const calculatorGateSchema = z.object({
  email,
  consent,
});

export type CalculatorGateInput = z.infer<typeof calculatorGateSchema>;

/** Candidatura de "Trabalhe conosco". */
export const jobApplicationFormSchema = z.object({
  name,
  email,
  phone: z.string().trim().min(8, "Telefone inválido").max(20),
  area: z.string().trim().min(1, "Selecione uma área").max(120),
  message: z.string().trim().max(2000).optional(),
  consent,
});

export type JobApplicationFormInput = z.infer<typeof jobApplicationFormSchema>;
