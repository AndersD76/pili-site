import type { MetadataRoute } from "next";
import { SITE_URL, LOCALES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/empresa",
    "/produtos",
    "/solucoes",
    "/obras",
    "/certificacoes",
    "/ecossistema",
    "/blog",
    "/contato",
    "/orcamento",
    "/catalogo",
    "/calculadora",
    "/trabalhe-conosco",
    "/politica-privacidade",
    "/politica-ambiental",
    "/termos",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of staticRoutes) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${SITE_URL}/${l}${route}`])
          ),
        },
      });
    }
  }

  return entries;
}
