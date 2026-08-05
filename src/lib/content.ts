import { cache } from "react";
import { getLocale } from "next-intl/server";
import { db } from "./db";
import { mediaUrl } from "./media";
import { logError } from "./prisma-errors";
import type { ProductCategory, PostCategory, Locale } from "@prisma/client";

/**
 * Leitura do conteúdo público a partir do banco.
 *
 * Substitui `src/lib/data/*.ts`. Enquanto o site lia daqueles arquivos e o
 * painel escrevia no Postgres, editar um produto no admin não mudava nada no
 * site — eram duas fontes desconectadas.
 *
 * Os tipos abaixo reproduzem a forma que as páginas já consumiam, para a troca
 * ser interna e não exigir reescrever cada componente.
 */

const LOCALE_PADRAO: Locale = "pt_BR";

/**
 * O enum do Prisma usa `pt_BR`; a rota usa `pt-BR`. A conversão fica aqui para
 * as páginas continuarem passando o locale do next-intl sem saber disso.
 */
function localeDoBanco(locale: string): Locale {
  return locale === "es" ? "es" : LOCALE_PADRAO;
}

/**
 * Escolhe a tradução do idioma pedido e cai para português quando ela ainda
 * não foi preenchida no painel — um produto sem versão em espanhol aparece em
 * português em vez de sumir da listagem.
 */
function traduzir<T extends { locale: Locale }>(
  traducoes: T[],
  alvo: Locale,
): T | undefined {
  return (
    traducoes.find((t) => t.locale === alvo) ??
    traducoes.find((t) => t.locale === LOCALE_PADRAO)
  );
}

/**
 * Idioma da requisição atual, já no formato do banco.
 *
 * O `generateStaticParams` roda fora de uma requisição e `getLocale()` lança
 * ali; como só precisamos dos slugs nesse momento, cair para português é o
 * comportamento certo em vez de quebrar o build.
 */
const localeAtual = cache(async (): Promise<Locale> => {
  try {
    return localeDoBanco(await getLocale());
  } catch {
    return LOCALE_PADRAO;
  }
});

/**
 * Usada quando o item ainda não tem foto própria. Mantém o layout intacto e
 * evita `null` propagando ate os componentes de imagem.
 */
const IMAGEM_PADRAO = "/images/tombador-pili.jpg";

/* ---------------------------------------------------------------- produtos */

export interface Produto {
  slug: string;
  category: string;
  name: string;
  tagline: string;
  description: string;
  capacity: string;
  length: string;
  specs: { label: string; value: string }[];
  features: { title: string; description: string; icon?: string }[];
  faqs: { question: string; answer: string }[];
  applications: string[];
  featured: boolean;
  image: string;
  images: { url: string; alt: string | null }[];
  metaTitle: string | null;
  metaDesc: string | null;
}

/** `capacity` e `length` vivem nas specs, com estes rótulos. */
function specValor(
  specs: { key: string; value: string }[],
  rotulo: string,
): string {
  return specs.find((s) => s.key.toLowerCase() === rotulo)?.value ?? "";
}

/**
 * Traz as duas traduções possíveis numa consulta só e resolve em memória — um
 * `where` fixo no idioma pedido devolveria lista vazia para o conteúdo que
 * ainda não foi traduzido.
 */
function selecaoProduto(locale: Locale) {
  const idiomas = { locale: { in: [locale, LOCALE_PADRAO] } };
  return {
    slug: true,
    category: true,
    featured: true,
    translations: {
      where: idiomas,
      select: {
        locale: true,
        name: true,
        tagline: true,
        description: true,
        metaTitle: true,
        metaDesc: true,
      },
    },
    specs: { orderBy: { order: "asc" }, select: { key: true, value: true } },
    features: {
      where: idiomas,
      orderBy: { order: "asc" },
      select: {
        locale: true,
        title: true,
        description: true,
        icon: true,
      },
    },
    faqs: {
      where: idiomas,
      orderBy: { order: "asc" },
      select: { locale: true, question: true, answer: true },
    },
    applications: { select: { slug: true } },
    media: {
      orderBy: { order: "asc" },
      select: { id: true, alt: true },
    },
  } as const;
}

type LinhaProduto = {
  slug: string;
  category: ProductCategory;
  featured: boolean;
  translations: {
    locale: Locale;
    name: string;
    tagline: string | null;
    description: string;
    metaTitle: string | null;
    metaDesc: string | null;
  }[];
  specs: { key: string; value: string }[];
  features: {
    locale: Locale;
    title: string;
    description: string;
    icon: string | null;
  }[];
  faqs: { locale: Locale; question: string; answer: string }[];
  applications: { slug: string }[];
  media: { id: string; alt: string | null }[];
};

function mapearProduto(p: LinhaProduto, locale: Locale): Produto {
  const t = traduzir(p.translations, locale);
  const imagens = p.media.map((m) => ({ url: mediaUrl(m.id), alt: m.alt }));

  // Os diferenciais também são traduzidos um a um; se nenhum existir no idioma
  // pedido, cai para a lista em português.
  const noIdioma = p.features.filter((f) => f.locale === locale);
  const features =
    noIdioma.length > 0
      ? noIdioma
      : p.features.filter((f) => f.locale === LOCALE_PADRAO);

  const faqsNoIdioma = p.faqs.filter((f) => f.locale === locale);
  const faqs =
    faqsNoIdioma.length > 0
      ? faqsNoIdioma
      : p.faqs.filter((f) => f.locale === LOCALE_PADRAO);

  return {
    slug: p.slug,
    category: p.category,
    name: t?.name ?? p.slug,
    tagline: t?.tagline ?? "",
    description: t?.description ?? "",
    capacity: specValor(p.specs, "capacidade"),
    length: specValor(p.specs, "comprimento"),
    specs: p.specs.map((s) => ({ label: s.key, value: s.value })),
    features: features.map((f) => ({
      title: f.title,
      description: f.description,
      icon: f.icon ?? undefined,
    })),
    faqs: faqs.map((f) => ({ question: f.question, answer: f.answer })),
    applications: p.applications.map((a) => a.slug),
    featured: p.featured,
    // A primeira mídia é a principal — a ordem é definida no painel.
    image: imagens[0]?.url ?? IMAGEM_PADRAO,
    images: imagens,
    metaTitle: t?.metaTitle ?? null,
    metaDesc: t?.metaDesc ?? null,
  };
}

export const getProdutos = cache(async (): Promise<Produto[]> => {
  const locale = await localeAtual();
  try {
    const linhas = await db.product.findMany({
      where: { active: true },
      select: selecaoProduto(locale),
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return linhas.map((l) => mapearProduto(l, locale));
  } catch (err) {
    logError("CONTENT_PRODUTOS", err);
    return [];
  }
});

export const getProduto = cache(async (slug: string): Promise<Produto | null> => {
  const locale = await localeAtual();
  try {
    const linha = await db.product.findFirst({
      where: { slug, active: true },
      select: selecaoProduto(locale),
    });
    return linha ? mapearProduto(linha, locale) : null;
  } catch (err) {
    logError("CONTENT_PRODUTO", err);
    return null;
  }
});

export async function getProdutosPorAplicacao(app: string): Promise<Produto[]> {
  const todos = await getProdutos();
  return todos.filter((p) => p.applications.includes(app));
}

export async function getProdutosPorCategoria(
  categoria: string,
): Promise<Produto[]> {
  const todos = await getProdutos();
  return todos.filter((p) => p.category === categoria);
}

/* ------------------------------------------------------------------ obras */

export interface Obra {
  slug: string;
  title: string;
  client: string;
  location: string;
  year: number;
  application: string;
  summary: string;
  content: string;
  metrics: { label: string; value: string }[];
  /// O schema não modela a relação obra→produto; fica vazio até existir.
  products: string[];
  featured: boolean;
  image: string;
  images: { url: string; alt: string | null }[];
}

function selecaoObra(locale: Locale) {
  const idiomas = { locale: { in: [locale, LOCALE_PADRAO] } };
  return {
    slug: true,
    client: true,
    location: true,
    year: true,
    featured: true,
    application: { select: { slug: true } },
    translations: {
      where: idiomas,
      select: { locale: true, title: true, summary: true, content: true },
    },
    metrics: { select: { label: true, value: true } },
    media: { orderBy: { order: "asc" }, select: { id: true, alt: true } },
  } as const;
}

type LinhaObra = {
  slug: string;
  client: string;
  location: string;
  year: number;
  featured: boolean;
  application: { slug: string } | null;
  translations: {
    locale: Locale;
    title: string;
    summary: string;
    content: string;
  }[];
  metrics: { label: string; value: string }[];
  media: { id: string; alt: string | null }[];
};

function mapearObra(c: LinhaObra, locale: Locale): Obra {
  const t = traduzir(c.translations, locale);
  const imagens = c.media.map((m) => ({ url: mediaUrl(m.id), alt: m.alt }));

  return {
    slug: c.slug,
    title: t?.title ?? c.slug,
    client: c.client,
    location: c.location,
    year: c.year,
    application: c.application?.slug ?? "",
    summary: t?.summary ?? "",
    content: t?.content ?? "",
    metrics: c.metrics,
    products: [],
    featured: c.featured,
    image: imagens[0]?.url ?? IMAGEM_PADRAO,
    images: imagens,
  };
}

export const getObras = cache(async (): Promise<Obra[]> => {
  const locale = await localeAtual();
  try {
    const linhas = await db.case.findMany({
      where: { active: true },
      select: selecaoObra(locale),
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    });
    return linhas.map((l) => mapearObra(l, locale));
  } catch (err) {
    logError("CONTENT_OBRAS", err);
    return [];
  }
});

export const getObra = cache(async (slug: string): Promise<Obra | null> => {
  const locale = await localeAtual();
  try {
    const linha = await db.case.findFirst({
      where: { slug, active: true },
      select: selecaoObra(locale),
    });
    return linha ? mapearObra(linha, locale) : null;
  } catch (err) {
    logError("CONTENT_OBRA", err);
    return null;
  }
});

export async function getObrasPorAplicacao(app: string): Promise<Obra[]> {
  const todas = await getObras();
  return todas.filter((o) => o.application === app);
}

/* ------------------------------------------------------------------ blog */

export interface Artigo {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: PostCategory;
  date: string;
  author: string;
  readTime: number;
  featured: boolean;
  image: string;
  tags: string[];
  metaTitle: string | null;
  metaDesc: string | null;
}

function selecaoArtigo(locale: Locale) {
  const idiomas = { locale: { in: [locale, LOCALE_PADRAO] } };
  return {
    slug: true,
    author: true,
    category: true,
    cover: true,
    readTime: true,
    publishedAt: true,
    createdAt: true,
    tags: true,
    translations: {
      where: idiomas,
      select: {
        locale: true,
        title: true,
        excerpt: true,
        content: true,
        metaTitle: true,
        metaDesc: true,
      },
    },
    media: { orderBy: { order: "asc" }, take: 1, select: { id: true } },
  } as const;
}

type LinhaArtigo = {
  slug: string;
  author: string;
  category: PostCategory;
  cover: string | null;
  readTime: number;
  publishedAt: Date | null;
  createdAt: Date;
  tags: string[];
  translations: {
    locale: Locale;
    title: string;
    excerpt: string;
    content: string;
    metaTitle: string | null;
    metaDesc: string | null;
  }[];
  media: { id: string }[];
};

function mapearArtigo(p: LinhaArtigo, locale: Locale): Artigo {
  const t = traduzir(p.translations, locale);
  const data = p.publishedAt ?? p.createdAt;

  return {
    slug: p.slug,
    title: t?.title ?? p.slug,
    excerpt: t?.excerpt ?? "",
    content: t?.content ?? "",
    category: p.category,
    date: data.toISOString().slice(0, 10),
    author: p.author,
    readTime: p.readTime,
    // Destaque do blog é o artigo mais recente; não há campo próprio no schema.
    featured: false,
    // A capa própria tem prioridade; `cover` cobre os artigos importados de
    // fora, que têm URL em vez de arquivo no banco.
    image: p.media[0]
      ? mediaUrl(p.media[0].id)
      : (p.cover ?? IMAGEM_PADRAO),
    tags: p.tags,
    metaTitle: t?.metaTitle ?? null,
    metaDesc: t?.metaDesc ?? null,
  };
}

export const getArtigos = cache(async (): Promise<Artigo[]> => {
  const locale = await localeAtual();
  try {
    const linhas = await db.post.findMany({
      where: { published: true },
      select: selecaoArtigo(locale),
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });

    const artigos = linhas.map((l) => mapearArtigo(l, locale));
    // O mais recente ocupa o espaço de destaque da listagem.
    if (artigos[0]) artigos[0].featured = true;
    return artigos;
  } catch (err) {
    logError("CONTENT_ARTIGOS", err);
    return [];
  }
});

export const getArtigo = cache(async (slug: string): Promise<Artigo | null> => {
  const locale = await localeAtual();
  try {
    const linha = await db.post.findFirst({
      where: { slug, published: true },
      select: selecaoArtigo(locale),
    });
    return linha ? mapearArtigo(linha, locale) : null;
  } catch (err) {
    logError("CONTENT_ARTIGO", err);
    return null;
  }
});

export async function getArtigosPorCategoria(
  categoria: string,
): Promise<Artigo[]> {
  const todos = await getArtigos();
  if (categoria === "todos") return todos;
  return todos.filter((a) => a.category === categoria);
}

/* ---------------------------------------------------------------- destaques */

export async function getProdutosDestaque(): Promise<Produto[]> {
  const todos = await getProdutos();
  const destaques = todos.filter((p) => p.featured);
  // Sem nenhum marcado, mostra os primeiros da ordenação para a home não ficar
  // com a seção vazia.
  return destaques.length > 0 ? destaques : todos.slice(0, 3);
}

export async function getObrasDestaque(): Promise<Obra[]> {
  const todas = await getObras();
  const destaques = todas.filter((o) => o.featured);
  return destaques.length > 0 ? destaques : todas.slice(0, 3);
}
