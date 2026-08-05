import type { Metadata } from "next";
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  COMPANY,
  SOCIAL,
} from "./constants";

/** Imagem padrão de compartilhamento. Precisa existir em `public/`. */
export const DEFAULT_OG_IMAGE = "/images/tombador-pili.jpg";

interface PageSeoParams {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  locale?: string;
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "",
  image = DEFAULT_OG_IMAGE,
  locale = "pt-BR",
  noIndex = false,
}: PageSeoParams): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    // `title.absolute` impede que o `template` do layout raiz concatene a marca
    // de novo — o resultado era "Produtos | PILI Industrial | PILI Industrial".
    title: { absolute: fullTitle },
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: {
        "pt-BR": `${SITE_URL}/pt-BR${path}`,
        es: `${SITE_URL}/es${path}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === "pt-BR" ? "pt_BR" : locale,
      type: "website",
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: COMPANY.name,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo-pili.png`,
    image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    description: SITE_DESCRIPTION,
    foundingDate: String(COMPANY.founded),
    // `sameAs` vincula o site aos perfis oficiais e alimenta o Knowledge Panel.
    sameAs: Object.values(SOCIAL),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Erechim",
      addressRegion: "RS",
      addressCountry: "BR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: COMPANY.phone,
      email: COMPANY.emailComercial,
      contactType: "sales",
      availableLanguage: ["Portuguese", "Spanish"],
    },
    taxID: COMPANY.cnpj,
  };
}

export function generateProductJsonLd(product: {
  name: string;
  description: string;
  image: string;
  slug: string;
  category: string;
  specs?: Record<string, string>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    url: `${SITE_URL}/pt-BR/produtos/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    manufacturer: {
      "@type": "Organization",
      name: COMPANY.name,
    },
    category: product.category,
  };
}

/**
 * Schema de artigo. Habilita rich result com data e miniatura no SERP e
 * elegibilidade ao Google Discover — canal relevante para conteúdo técnico do
 * agronegócio.
 */
export function generateArticleJsonLd(article: {
  title: string;
  description: string;
  image: string;
  slug: string;
  publishedAt: string;
  author: string;
  tags?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image.startsWith("http")
      ? article.image
      : `${SITE_URL}${article.image}`,
    url: `${SITE_URL}/pt-BR/blog/${article.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/pt-BR/blog/${article.slug}`,
    },
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: { "@type": "Organization", name: article.author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo-pili.png`,
      },
    },
    keywords: article.tags?.join(", "),
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Serializa JSON-LD para injeção em `<script>`.
 *
 * `JSON.stringify` não escapa `<`, então um valor contendo `</script>` fecharia
 * o bloco e permitiria injeção. Hoje os dados são estáticos, mas passam a ser
 * editáveis pelo painel quando o site ler do banco.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

/**
 * Rich result de FAQ.
 *
 * O `FAQPage` só é válido quando as perguntas estão visíveis na página — o
 * Google penaliza marcação sem contrapartida. Por isso este helper é chamado
 * apenas quando a seção de perguntas é de fato renderizada.
 */
export function generateFaqJsonLd(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
