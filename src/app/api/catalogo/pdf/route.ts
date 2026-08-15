import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { db } from "@/lib/db";
import { getSiteSettings } from "@/lib/site-settings";
import { CatalogoPdf, type ProdutoPdf } from "@/lib/catalogo-pdf";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

async function logoComoDataUri(nome: string): Promise<string> {
  const caminho = join(process.cwd(), "public", "images", nome);
  const buffer = await readFile(caminho);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

async function imagemDoProduto(mediaId: string | null): Promise<string | null> {
  if (!mediaId) return null;
  try {
    const media = await db.media.findUnique({
      where: { id: mediaId },
      select: { data: true, mimeType: true },
    });
    if (!media) return null;
    const b64 = Buffer.from(media.data).toString("base64");
    return `data:${media.mimeType};base64,${b64}`;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const [produtos, settings, logo, logoWhite] = await Promise.all([
      db.product.findMany({
        where: { active: true },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        select: {
          slug: true,
          category: true,
          translations: {
            where: { locale: "pt_BR" },
            select: { name: true, tagline: true, description: true },
          },
          specs: {
            orderBy: { order: "asc" },
            select: { key: true, value: true },
          },
          media: {
            orderBy: { order: "asc" },
            take: 1,
            select: { id: true },
          },
        },
      }),
      getSiteSettings(),
      logoComoDataUri("logo-pili.png"),
      logoComoDataUri("logo-pili-white.png"),
    ]);

    const produtosPdf: ProdutoPdf[] = await Promise.all(
      produtos.map(async (p) => {
        const t = p.translations[0];
        const mediaId = p.media[0]?.id ?? null;
        return {
          slug: p.slug,
          category: p.category,
          name: t?.name ?? p.slug,
          tagline: t?.tagline ?? "",
          description: t?.description ?? "",
          specs: p.specs.map((s) => ({ label: s.key, value: s.value })),
          imageDataUri: await imagemDoProduto(mediaId),
        };
      }),
    );

    const agora = new Date();
    const geradoEm = agora.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
    });

    const doc = CatalogoPdf({
      produtos: produtosPdf,
      logoDataUri: logo,
      logoWhiteDataUri: logoWhite,
      contato: {
        telefone: settings.telefone,
        email: settings.email,
        site: "pili.ind.br",
        endereco: settings.endereco,
      },
      geradoEm,
    });

    const buffer = await renderToBuffer(doc);
    const uint8 = new Uint8Array(buffer);

    return new NextResponse(uint8, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="catalogo-pili-industrial.pdf"',
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("[CATALOGO_PDF]", err);
    return NextResponse.json(
      { error: "Erro ao gerar o catalogo" },
      { status: 500 },
    );
  }
}
