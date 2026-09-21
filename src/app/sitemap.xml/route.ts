import { SITE_URL } from "@/lib/constants";
import { ARQUIVOS, entradas, maisRecente, xmlIndice } from "@/lib/sitemaps";

/**
 * Índice de sitemaps.
 *
 * O robots.txt e o Search Console apontam para este endereço. Ele lista um
 * arquivo por tipo de página, gerados em /sitemaps/<tipo>.xml.
 */
export const revalidate = 86400;

export async function GET() {
  const itens = await Promise.all(
    ARQUIVOS.map(async (arquivo) => ({
      url: `${SITE_URL}/sitemaps/${arquivo}.xml`,
      lastmod: maisRecente(await entradas(arquivo)),
    })),
  );

  return new Response(xmlIndice(itens), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
