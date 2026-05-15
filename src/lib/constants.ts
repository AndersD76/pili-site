export const SITE_NAME = "PILI Industrial";
export const SITE_DESCRIPTION =
  "Fabricante de tombadores hidráulicos e plataformas de descarga de grãos desde 1979. De 9 a 30 metros, 35 a 100 toneladas.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pili.ind.br";

export const COMPANY = {
  name: "M.B. Pili Equipamentos Industriais Ltda",
  cnpj: "05.620.512/0001-74",
  address: "Erechim/RS",
  phone: "+55 54 3522-2828",
  whatsapp: "+55 54 99141-2971",
  email: "atendimento@pili.ind.br",
  emailComercial: "comercial@pili.ind.br",
  founded: 1979,
} as const;

export const ECOSYSTEM = {
  store: process.env.PILI_STORE_URL ?? "https://store.pili.ind.br",
  tech: process.env.PILI_TECH_URL ?? "https://tech.pili.ind.br",
  raste: process.env.PILI_RASTE_URL ?? "https://raste.pili.ind.br",
  harbor: process.env.PILI_HARBOR_URL ?? "https://harbor.pili.ind.br",
} as const;

export const SOCIAL = {
  instagram: "https://www.instagram.com/pili.ind",
  linkedin: "https://www.linkedin.com/company/103457141",
  facebook: "https://www.facebook.com/pilierechim",
  youtube: "https://www.youtube.com/channel/UCkjB-kHuDaB9tKHtFcp-S8g",
} as const;

export const LOCALES = ["pt-BR", "en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "pt-BR";

export const STATS = {
  years: new Date().getFullYear() - COMPANY.founded,
  equipment: "850+",
  countries: 18,
  maxCapacity: "100t",
} as const;

export const APPLICATIONS = [
  "porto",
  "cooperativa",
  "industria",
  "fertilizante",
  "cimento",
] as const;
export type Application = (typeof APPLICATIONS)[number];
