import type { MetadataRoute } from "next";
import { SITE_URL, LOCALES } from "@/lib/constants";
import { getProdutos, getObras, getArtigos } from "@/lib/content";
import { ECOSYSTEM_PROJECTS } from "@/lib/data/ecosystem";
import { APPLICATIONS } from "@/lib/constants";

/**
 * Sitemap com todas as páginas indexáveis.
 *
 * Antes listava apenas as 16 rotas institucionais: as páginas de detalhe —
 * justamente as que têm intenção de busca específica ("tombador 30 metros",
 * "descarga de grãos porto Paranaguá") — ficavam de fora.
 */

interface RouteEntry {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  lastModified: Date;
}

/** Data fixa de referência para conteúdo sem data própria. */
const CONTENT_BASELINE = new Date("2026-07-01T00:00:00.000Z");

function staticRoutes(): RouteEntry[] {
  const routes: [string, number][] = [
    ["", 1],
    ["/produtos", 0.9],
    ["/solucoes", 0.9],
    ["/obras", 0.8],
    ["/blog", 0.8],
    ["/empresa", 0.7],
    ["/certificacoes", 0.7],
    ["/ecossistema", 0.7],
    ["/contato", 0.7],
    ["/orcamento", 0.8],
    ["/catalogo", 0.7],
    ["/calculadora", 0.7],
    ["/produtos/comparar", 0.6],
    ["/trabalhe-conosco", 0.5],
    ["/politica-privacidade", 0.3],
    ["/politica-ambiental", 0.3],
    ["/termos", 0.3],
  ];

  return routes.map(([path, priority]) => ({
    path,
    priority,
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    lastModified: CONTENT_BASELINE,
  }));
}

async function contentRoutes(): Promise<RouteEntry[]> {
  const PRODUCTS = await getProdutos();
  const CASES = await getObras();
  const BLOG_POSTS = await getArtigos();

  const entries: RouteEntry[] = [];

  for (const product of PRODUCTS) {
    entries.push({
      path: `/produtos/${product.slug}`,
      priority: 0.9,
      changeFrequency: "monthly",
      lastModified: CONTENT_BASELINE,
    });
  }

  for (const caseItem of CASES) {
    entries.push({
      path: `/obras/${caseItem.slug}`,
      priority: 0.7,
      changeFrequency: "yearly",
      lastModified: CONTENT_BASELINE,
    });
  }

  for (const post of BLOG_POSTS) {
    entries.push({
      path: `/blog/${post.slug}`,
      priority: 0.6,
      changeFrequency: "yearly",
      // Data real de publicação do artigo — o sinal que o Google usa para
      // decidir se vale revisitar.
      lastModified: new Date(post.date),
    });
  }

  for (const project of ECOSYSTEM_PROJECTS) {
    entries.push({
      path: `/ecossistema/${project.slug}`,
      priority: 0.6,
      changeFrequency: "monthly",
      lastModified: CONTENT_BASELINE,
    });
  }

  for (const sector of APPLICATIONS) {
    entries.push({
      path: `/solucoes/${sector}`,
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: CONTENT_BASELINE,
    });
  }

  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const all = [...staticRoutes(), ...(await contentRoutes())];
  const entries: MetadataRoute.Sitemap = [];

  for (const route of all) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${route.path}`,
        lastModified: route.lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${SITE_URL}/${l}${route.path}`]),
          ),
        },
      });
    }
  }

  return entries;
}
