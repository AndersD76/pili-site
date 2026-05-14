import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, COMPANY } from "./constants";

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
  image = "/images/og-default.jpg",
  locale = "pt-BR",
  noIndex = false,
}: PageSeoParams): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: {
        "pt-BR": `${SITE_URL}/pt-BR${path}`,
        en: `${SITE_URL}/en${path}`,
        es: `${SITE_URL}/es${path}`,
      },
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === "pt-BR" ? "pt_BR" : locale,
      type: "website",
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
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
    logo: `${SITE_URL}/images/logo.svg`,
    foundingDate: String(COMPANY.founded),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Erechim",
      addressRegion: "RS",
      addressCountry: "BR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: COMPANY.phone,
      contactType: "sales",
      availableLanguage: ["Portuguese", "English", "Spanish"],
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
