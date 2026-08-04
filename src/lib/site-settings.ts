import { cache } from "react";
import { db } from "./db";
import { COMPANY, SOCIAL, ECOSYSTEM } from "./constants";
import { logError } from "./prisma-errors";

/**
 * Dados institucionais do site.
 *
 * Vinham de `src/lib/constants.ts` — mudar um telefone exigia commit e deploy.
 * Agora saem da tabela `SiteSettings`, com os valores de `constants.ts` como
 * fallback: se o banco estiver indisponível ou a linha não existir, o site
 * continua servindo os dados corretos em vez de quebrar.
 */

export interface SiteSettingsData {
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  whatsapp: string;
  email: string;
  emailComercial: string;
  fundacao: number;
  instagram: string | null;
  linkedin: string | null;
  facebook: string | null;
  youtube: string | null;
  piliTechUrl: string | null;
}

const FALLBACK: SiteSettingsData = {
  razaoSocial: COMPANY.name,
  cnpj: COMPANY.cnpj,
  endereco: COMPANY.address,
  telefone: COMPANY.phone,
  whatsapp: COMPANY.whatsapp,
  email: COMPANY.email,
  emailComercial: COMPANY.emailComercial,
  fundacao: COMPANY.founded,
  instagram: SOCIAL.instagram,
  linkedin: SOCIAL.linkedin,
  facebook: SOCIAL.facebook,
  youtube: SOCIAL.youtube,
  piliTechUrl: ECOSYSTEM.tech,
};

/**
 * Uma consulta por requisição, no máximo — `cache` do React deduplica as
 * chamadas dentro do mesmo render.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettingsData> => {
  try {
    const row = await db.siteSettings.findUnique({ where: { id: "default" } });
    if (!row) return FALLBACK;

    return {
      razaoSocial: row.razaoSocial,
      cnpj: row.cnpj,
      endereco: row.endereco,
      telefone: row.telefone,
      whatsapp: row.whatsapp,
      email: row.email,
      emailComercial: row.emailComercial,
      fundacao: row.fundacao,
      instagram: row.instagram,
      linkedin: row.linkedin,
      facebook: row.facebook,
      youtube: row.youtube,
      piliTechUrl: row.piliTechUrl,
    };
  } catch (err) {
    logError("SITE_SETTINGS", err);
    return FALLBACK;
  }
});

/** Só os dígitos, para montar links `wa.me` e `tel:`. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}
