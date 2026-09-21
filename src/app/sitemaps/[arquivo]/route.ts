import { ARQUIVOS, entradas, xmlUrlset, type Arquivo } from "@/lib/sitemaps";

/** Um sitemap por tipo de página — ver src/lib/sitemaps.ts. */
export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return ARQUIVOS.map((arquivo) => ({ arquivo: `${arquivo}.xml` }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ arquivo: string }> },
) {
  const { arquivo } = await params;
  const nome = arquivo.replace(/\.xml$/, "") as Arquivo;
  if (!ARQUIVOS.includes(nome)) {
    return new Response("Sitemap inexistente", { status: 404 });
  }

  return new Response(xmlUrlset(await entradas(nome)), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
