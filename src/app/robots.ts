import type { MetadataRoute } from "next";
import { SITE_URL, EM_DOMINIO_DEFINITIVO } from "@/lib/constants";

/**
 * Fora do domínio definitivo, o site inteiro sai do índice.
 *
 * Enquanto `pili.ind.br` serve o site antigo e este projeto roda num endereço
 * provisório, deixar o provisório indexável cria dois problemas: ele compete
 * com o domínio real nas buscas e, depois da virada, permanece no índice como
 * cópia do mesmo conteúdo. Um `Disallow: /` evita os dois — e some sozinho
 * assim que `NEXT_PUBLIC_SITE_URL` apontar para o domínio definitivo.
 */
export default function robots(): MetadataRoute.Robots {
  if (!EM_DOMINIO_DEFINITIVO) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/portal/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
