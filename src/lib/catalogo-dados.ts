import { db } from "./db";
import { PRODUTO_PUBLICAVEL, fotoUsavel } from "./produto-publicavel";
import { mediaUrl } from "./media";
import type { ProductCategory } from "@prisma/client";

/**
 * Conteúdo do catálogo, para a revista folheável do site.
 *
 * O PDF em `catalogo-pdf.tsx` monta os mesmos dados, mas embute cada foto como
 * data URI — o `@react-pdf/renderer` não busca imagem por URL. Na tela isso
 * seria desperdício: o navegador carrega `/api/media/<id>` sozinho, com cache,
 * e só as páginas visíveis. Por isso a revista tem a sua própria montagem em
 * vez de reaproveitar a do PDF.
 */

export type LocaleCatalogo = "pt-BR" | "es";

/** Fotos por produto. Mais do que isso e a revista vira álbum. */
const FOTOS_POR_PRODUTO = 3;

/** FAQs por produto, as mesmas que o PDF imprime. */
const FAQS_POR_PRODUTO = 3;

export interface ProdutoRevista {
  slug: string;
  category: ProductCategory;
  name: string;
  tagline: string;
  description: string;
  specs: { key: string; value: string }[];
  features: { title: string; description: string; icon: string | null }[];
  faqs: { question: string; answer: string }[];
  /** URLs de `/api/media/<id>`, na ordem definida pelo painel. */
  imagens: string[];
}

export async function getProdutosRevista(
  locale: LocaleCatalogo,
): Promise<ProdutoRevista[]> {
  const localeDb = locale === "es" ? "es" : "pt_BR";

  const produtos = await db.product.findMany({
    where: PRODUTO_PUBLICAVEL,
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: {
      slug: true,
      category: true,
      translations: {
        select: { locale: true, name: true, tagline: true, description: true },
      },
      specs: { orderBy: { order: "asc" }, select: { key: true, value: true } },
      features: {
        orderBy: { order: "asc" },
        select: { locale: true, title: true, description: true, icon: true },
      },
      faqs: {
        orderBy: { order: "asc" },
        select: { locale: true, question: true, answer: true },
      },
      media: {
        orderBy: { order: "asc" },
        select: { id: true, filename: true, type: true },
      },
    },
  });

  return produtos.map((p) => {
    /**
     * Nem todo produto tem versão no idioma pedido — o coletor móvel, por
     * exemplo, só foi cadastrado em pt-BR. Cair no português é melhor do que
     * mostrar o slug na revista.
     */
    const t =
      p.translations.find((tr) => tr.locale === localeDb) ??
      p.translations.find((tr) => tr.locale === "pt_BR");

    const features = p.features.filter((f) => f.locale === localeDb);
    const faqs = p.faqs.filter((f) => f.locale === localeDb);

    return {
      slug: p.slug,
      category: p.category,
      name: t?.name ?? p.slug,
      tagline: t?.tagline ?? "",
      description: t?.description ?? "",
      specs: p.specs,
      features: (features.length > 0
        ? features
        : p.features.filter((f) => f.locale === "pt_BR")
      ).map(({ title, description, icon }) => ({ title, description, icon })),
      faqs: (faqs.length > 0
        ? faqs
        : p.faqs.filter((f) => f.locale === "pt_BR")
      )
        .slice(0, FAQS_POR_PRODUTO)
        .map(({ question, answer }) => ({ question, answer })),
      imagens: p.media
        .filter((m) => m.type === "image" && fotoUsavel(m.filename))
        .slice(0, FOTOS_POR_PRODUTO)
        .map((m) => mediaUrl(m.id)),
    };
  });
}
