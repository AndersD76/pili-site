import type { LeadStatus, LeadSource } from "@prisma/client";

/**
 * Fonte única de rótulos e cores de lead.
 *
 * Antes esta configuração estava duplicada em 5 arquivos, com divergência real
 * (o dashboard renderizava o mesmo status sem borda e a listagem com borda).
 * Os `Record<Enum, …>` garantem em tempo de compilação que todo valor novo do
 * enum seja tratado aqui.
 */

export const STATUS_LABELS: Record<LeadStatus, string> = {
  NOVO: "Novo",
  QUALIFICADO: "Qualificado",
  CONTATADO: "Contatado",
  PROPOSTA: "Proposta",
  GANHO: "Ganho",
  PERDIDO: "Perdido",
};

/** Classe do badge de status. Usada por todas as telas. */
export const STATUS_COLORS: Record<LeadStatus, string> = {
  NOVO: "bg-blue-100 text-blue-800 border-blue-200",
  QUALIFICADO: "bg-amber-100 text-amber-800 border-amber-200",
  CONTATADO: "bg-purple-100 text-purple-800 border-purple-200",
  PROPOSTA: "bg-cyan-100 text-cyan-800 border-cyan-200",
  GANHO: "bg-green-100 text-green-800 border-green-200",
  PERDIDO: "bg-red-100 text-red-800 border-red-200",
};

/** Marcador circular usado nos menus de troca de status. */
export const STATUS_DOTS: Record<LeadStatus, string> = {
  NOVO: "bg-blue-500",
  QUALIFICADO: "bg-amber-500",
  CONTATADO: "bg-purple-500",
  PROPOSTA: "bg-cyan-500",
  GANHO: "bg-green-500",
  PERDIDO: "bg-red-500",
};

export const STATUS_OPTIONS = (
  Object.keys(STATUS_LABELS) as LeadStatus[]
).map((value) => ({
  value,
  label: STATUS_LABELS[value],
  color: STATUS_DOTS[value],
}));

export const SOURCE_LABELS: Record<LeadSource, string> = {
  ORGANICO: "Orgânico",
  PAGO: "Pago",
  REFERRAL: "Indicação",
  WHATSAPP: "WhatsApp",
  CATALOGO: "Catálogo",
  CALCULADORA: "Calculadora",
  COMPARATIVO: "Comparativo",
  FORMULARIO: "Formulário",
  TRABALHE_CONOSCO: "Trabalhe conosco",
};

export const SOURCE_OPTIONS = (
  Object.keys(SOURCE_LABELS) as LeadSource[]
).map((value) => ({ value, label: SOURCE_LABELS[value] }));
