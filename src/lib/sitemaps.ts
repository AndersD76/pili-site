import { SITE_URL, LOCALES, APPLICATIONS } from "@/lib/constants";
import { db } from "@/lib/db";
import { PRODUTO_PUBLICAVEL } from "@/lib/produto-publicavel";
import { ECOSYSTEM_PROJECTS } from "@/lib/data/ecosystem";
import {
  CULTURAS,
  EMPRESAS,
  MUNICIPIOS,
  PORTES,
  UFS,
  slugPorte,
} from "@/lib/mercado-graos/dados";
import { ATUALIZADO_EM } from "@/lib/mercado-graos/fontes";

/**
 * Sitemaps segmentados por tipo de página.
 *
 * Um arquivo por tipo deixa o relatório do Search Console legível — dá para
 * ver quantas páginas de município foram enviadas e quantas entraram no
 * índice, separado das de produto. Cada arquivo fica bem abaixo do limite de
 * 50 mil URLs.
 *
 * Só entra aqui o que existe de verdade: as listas de mercado de grãos já vêm
 * filtradas pelo gate de qualidade, e os produtos seguem a regra de publicação
 * do site. O `lastmod` é sempre uma data real — da fonte, do banco ou do
 * artigo —, nunca a data do build.
 */

export interface Entrada {
  url: string;
  lastmod?: string;
  /** Versões em outros idiomas, para o hreflang do sitemap. */
  alternativas?: Record<string, string>;
}

export const ARQUIVOS = [
  "institucional",
  "armazenagem",
  "producao",
  "armazenadores",
  "ferramentas",
] as const;
export type Arquivo = (typeof ARQUIVOS)[number];

const pt = (path: string) => `${SITE_URL}/pt-BR${path}`;

/** Página que existe nos dois idiomas: uma entrada por idioma, com hreflang. */
function bilingue(path: string, lastmod?: string): Entrada[] {
  const alternativas = {
    ...Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`])),
    "x-default": pt(path),
  };
  return LOCALES.map((l) => ({
    url: `${SITE_URL}/${l}${path}`,
    lastmod,
    alternativas,
  }));
}

async function institucional(): Promise<Entrada[]> {
  const fixas = [
    "",
    "/produtos",
    "/solucoes",
    "/obras",
    "/blog",
    "/empresa",
    "/certificacoes",
    "/ecossistema",
    "/contato",
    "/orcamento",
    "/catalogo",
    "/calculadora",
    "/produtos/comparar",
    "/trabalhe-conosco",
    "/politica-privacidade",
    "/politica-ambiental",
    "/termos",
    ...APPLICATIONS.map((a) => `/solucoes/${a}`),
    ...ECOSYSTEM_PROJECTS.map((p) => `/ecossistema/${p.slug}`),
  ];

  // Datas reais do banco. Página sem data própria sai sem `lastmod` — o campo
  // é opcional, e uma data inventada ensina o Google a ignorá-lo.
  const [produtos, obras, posts] = await Promise.all([
    db.product
      .findMany({ where: PRODUTO_PUBLICAVEL, select: { slug: true, updatedAt: true } })
      .catch(() => []),
    db.case
      .findMany({ where: { active: true }, select: { slug: true, updatedAt: true } })
      .catch(() => []),
    db.post
      .findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true, publishedAt: true },
      })
      .catch(() => []),
  ]);

  return [
    ...fixas.flatMap((path) => bilingue(path)),
    ...produtos.flatMap((p) => bilingue(`/produtos/${p.slug}`, p.updatedAt.toISOString())),
    ...obras.flatMap((o) => bilingue(`/obras/${o.slug}`, o.updatedAt.toISOString())),
    ...posts.flatMap((p) =>
      bilingue(`/blog/${p.slug}`, (p.updatedAt ?? p.publishedAt)?.toISOString()),
    ),
  ];
}

function armazenagem(): Entrada[] {
  return [
    { url: pt("/armazenagem"), lastmod: ATUALIZADO_EM },
    ...UFS.map((u) => ({ url: pt(`/armazenagem/${u.slug}`), lastmod: ATUALIZADO_EM })),
    ...MUNICIPIOS.map((m) => ({
      url: pt(`/armazenagem/${m.uf.toLowerCase()}/${m.slug}`),
      lastmod: ATUALIZADO_EM,
    })),
  ];
}

function producao(): Entrada[] {
  const entradas: Entrada[] = CULTURAS.map((c) => ({
    url: pt(`/producao/${c}`),
    lastmod: ATUALIZADO_EM,
  }));
  for (const u of UFS) {
    for (const c of CULTURAS) {
      if (u.culturas[c]?.pagina) {
        entradas.push({ url: pt(`/producao/${c}/${u.slug}`), lastmod: ATUALIZADO_EM });
      }
    }
  }
  for (const m of MUNICIPIOS) {
    for (const c of CULTURAS) {
      if (m.culturas[c]?.pagina) {
        entradas.push({
          url: pt(`/producao/${c}/${m.uf.toLowerCase()}/${m.slug}`),
          lastmod: ATUALIZADO_EM,
        });
      }
    }
  }
  return entradas;
}

function armazenadores(): Entrada[] {
  return [
    { url: pt("/armazenadores"), lastmod: ATUALIZADO_EM },
    ...EMPRESAS.map((e) => ({ url: pt(`/armazenadores/${e.slug}`), lastmod: ATUALIZADO_EM })),
  ];
}

function ferramentas(): Entrada[] {
  return [
    { url: pt("/unidade-de-recebimento"), lastmod: ATUALIZADO_EM },
    ...PORTES.map((p) => ({
      url: pt(`/unidade-de-recebimento/${slugPorte(p.sacas)}`),
      lastmod: ATUALIZADO_EM,
    })),
    { url: pt("/tombador-para") },
    ...["caminhao", "carreta", "bitrem", "rodotrem"].map((v) => ({
      url: pt(`/tombador-para/${v}`),
    })),
  ];
}

export async function entradas(arquivo: Arquivo): Promise<Entrada[]> {
  switch (arquivo) {
    case "institucional":
      return institucional();
    case "armazenagem":
      return armazenagem();
    case "producao":
      return producao();
    case "armazenadores":
      return armazenadores();
    case "ferramentas":
      return ferramentas();
  }
}

/** Data mais recente de um arquivo — vira o `lastmod` no índice. */
export function maisRecente(lista: Entrada[]): string | undefined {
  return lista
    .map((e) => e.lastmod)
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1);
}

const escapar = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function xmlUrlset(lista: Entrada[]): string {
  const corpo = lista
    .map((e) => {
      const alternativas = e.alternativas
        ? Object.entries(e.alternativas)
            .map(
              ([lang, href]) =>
                `<xhtml:link rel="alternate" hreflang="${lang}" href="${escapar(href)}"/>`,
            )
            .join("")
        : "";
      return `<url><loc>${escapar(e.url)}</loc>${
        e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""
      }${alternativas}</url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${corpo}
</urlset>`;
}

export function xmlIndice(itens: { url: string; lastmod?: string }[]): string {
  const corpo = itens
    .map(
      (i) =>
        `<sitemap><loc>${escapar(i.url)}</loc>${
          i.lastmod ? `<lastmod>${i.lastmod}</lastmod>` : ""
        }</sitemap>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${corpo}
</sitemapindex>`;
}
