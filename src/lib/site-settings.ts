import { cache } from "react";
import { db } from "./db";
import { COMPANY, SOCIAL, ECOSYSTEM, STATS } from "./constants";
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
  mapaLat: number | null;
  mapaLng: number | null;
  mapaZoom: number;
  statsEquipamentos: string;
  statsPaises: number;
  statsCapacidade: string;
}

/**
 * Anos de mercado.
 *
 * Calculado, nunca digitado: um número fixo no painel envelheceria sozinho na
 * virada do ano.
 */
export function anosDeMercado(s: SiteSettingsData): number {
  return new Date().getFullYear() - s.fundacao;
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
  // Erechim/RS, onde fica a fábrica.
  mapaLat: -27.6339,
  mapaLng: -52.2739,
  mapaZoom: 14,
  statsEquipamentos: STATS.equipment,
  statsPaises: STATS.countries,
  statsCapacidade: STATS.maxCapacity,
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
      mapaLat: row.mapaLat,
      mapaLng: row.mapaLng,
      mapaZoom: row.mapaZoom,
      statsEquipamentos: row.statsEquipamentos,
      statsPaises: row.statsPaises,
      statsCapacidade: row.statsCapacidade,
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

/**
 * Redes sociais preenchidas, na ordem de exibição.
 *
 * Campo vazio no painel significa "não temos essa rede" — o link some do site
 * em vez de apontar para lugar nenhum.
 */
export function redesSociais(s: SiteSettingsData) {
  return [
    { name: "Instagram", url: s.instagram },
    { name: "LinkedIn", url: s.linkedin },
    { name: "Facebook", url: s.facebook },
    { name: "YouTube", url: s.youtube },
  ].filter((r): r is { name: string; url: string } => Boolean(r.url));
}
