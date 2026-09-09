export const SITE_NAME = "PILI Industrial";
export const SITE_DESCRIPTION =
  "Fabricante de tombadores hidráulicos e plataformas de descarga de grãos desde 1979. De 9 a 30 metros, 35 a 100 toneladas.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pili.ind.br";

/**
 * Domínio definitivo do site.
 *
 * É `www` e não a raiz: o Railway não aceita CNAME em domínio apex, e o A/AAAA
 * da raiz aponta para a KingHost, que ainda serve o site antigo em Apache. Este
 * projeto responde em `www.pili.ind.br`, então é esse o endereço que o Google
 * deve indexar — canonical, hreflang e sitemap saem daqui.
 *
 * Comparar `SITE_URL` com isto é o que bloqueia a indexação de qualquer
 * endereço provisório (o `*.up.railway.app`, por exemplo): sem isso o Google
 * indexa o temporário, que vira conteúdo duplicado competindo com o real.
 *
 * Quando a raiz passar a redirecionar para `www`, nada aqui muda.
 */
export const DOMINIO_DEFINITIVO = "https://www.pili.ind.br";

/** Estamos servindo do domínio definitivo? */
export const EM_DOMINIO_DEFINITIVO = SITE_URL === DOMINIO_DEFINITIVO;

export const COMPANY = {
  name: "M.B. Pili Equipamentos Industriais Ltda",
  cnpj: "05.620.512/0001-74",
  address: "Erechim/RS",
  phone: "+55 54 3522-2828",
  whatsapp: "+55 54 99141-2971",
  email: "atendimento@pili.ind.br",
  emailComercial: "comercial@pili.ind.br",
  /**
   * Remetente das mensagens automáticas. Precisa estar verificado no Resend —
   * antes o fallback era "contato@pili.ind.br", endereço que não existia em
   * lugar nenhum da configuração e que faria o envio ser recusado.
   */
  emailRemetente: "atendimento@pili.ind.br",
  founded: 1979,
} as const;

/**
 * Plataformas do ecossistema divulgadas no site.
 *
 * Store, Raster e Harbor foram retirados: só o Tech está no ar. Anunciar
 * plataforma que não existe custa credibilidade e gera link quebrado.
 */
export const ECOSYSTEM = {
  // `tech.pili.ind.br` nunca chegou a existir: o subdominio nao resolve e o
  // link do PILI Tech no header e no rodape apontava para uma pagina de erro.
  // A plataforma vive em dominio proprio.
  tech: process.env.PILI_TECH_URL ?? "https://www.pilitech.com.br",
} as const;

export const SOCIAL = {
  instagram: "https://www.instagram.com/pili.ind",
  linkedin: "https://www.linkedin.com/company/103457141",
  facebook: "https://www.facebook.com/pilierechim",
  youtube: "https://www.youtube.com/channel/UCkjB-kHuDaB9tKHtFcp-S8g",
} as const;

export const LOCALES = ["pt-BR", "es"] as const;
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
