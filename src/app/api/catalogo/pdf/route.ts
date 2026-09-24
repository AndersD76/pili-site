import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import sharp from "sharp";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { db } from "@/lib/db";
import { getSiteSettings } from "@/lib/site-settings";
import { CatalogoPdf, type ProdutoPdf } from "@/lib/catalogo-pdf";
import type { LocaleCatalogo } from "@/lib/catalogo-i18n";
import { PRODUTO_PUBLICAVEL, fotoUsavel } from "@/lib/produto-publicavel";

export const runtime = "nodejs";
// O catalogo sai do banco a cada download: nada de cache estatico.
export const dynamic = "force-dynamic";

/** Quantas fotos entram por produto: 1 na ficha + ate 3 na pagina de detalhe. */
const FOTOS_POR_PRODUTO = 4;

async function logoComoDataUri(nome: string): Promise<string> {
  const buffer = await readFile(join(process.cwd(), "public", "images", nome));
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

/**
 * As fotos do banco tem ate 1 MB cada. Sem reduzir, o catalogo passa de 30 MB
 * e nao serve para mandar por e-mail.
 */
async function comprimir(data: Uint8Array, largura: number): Promise<string> {
  const jpeg = await sharp(Buffer.from(data))
    .rotate()
    .resize({ width: largura, withoutEnlargement: true })
    .jpeg({ quality: 72, mozjpeg: true })
    .toBuffer();
  return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
}

/**
 * PDFs já gerados, por idioma.
 *
 * Gerar o catálogo carrega ~40 fotos do banco, comprime cada uma e desenha 23
 * páginas: uns 3 s no servidor, e o folheto do site esperava ~10 s pela
 * primeira página. A versão é o hash dos dados que entram no PDF — produtos
 * (sem as fotos, cujo id muda quando o arquivo muda), configurações e mês da
 * capa —, então qualquer edição no painel gera um PDF novo no pedido seguinte.
 * Guardar a promessa, e não o buffer, faz pedidos simultâneos dividirem a
 * mesma geração.
 */
const gerados = new Map<
  LocaleCatalogo,
  { versao: string; pdf: Promise<Buffer> }
>();

/** Tudo que entra no PDF, menos o binário das fotos. */
function buscarProdutos() {
  return db.product.findMany({
    where: PRODUTO_PUBLICAVEL,
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: {
      slug: true,
      category: true,
      translations: {
        select: {
          locale: true,
          name: true,
          tagline: true,
          description: true,
        },
      },
      specs: { orderBy: { order: "asc" }, select: { key: true, value: true } },
      features: {
        orderBy: { order: "asc" },
        select: {
          locale: true,
          title: true,
          description: true,
          icon: true,
        },
      },
      applications: { select: { slug: true } },
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
}

type ProdutosDoBanco = Awaited<ReturnType<typeof buscarProdutos>>;

export async function GET(request: Request) {
  try {
    const param = new URL(request.url).searchParams.get("locale");
    const locale: LocaleCatalogo = param === "es" ? "es" : "pt-BR";
    const localeDb = locale === "es" ? "es" : "pt_BR";

    const [produtos, settings, logo, logoWhite] = await Promise.all([
      buscarProdutos(),
      getSiteSettings(),
      logoComoDataUri("logo-pili.png"),
      logoComoDataUri("logo-pili-white.png"),
    ]);

    // es-419: espanhol da America Latina, nao o da Espanha.
    const geradoEm = new Date().toLocaleDateString(
      locale === "es" ? "es-419" : "pt-BR",
      { year: "numeric", month: "long" },
    );

    const versao = createHash("sha1")
      .update(JSON.stringify({ produtos, settings, geradoEm }))
      .digest("hex");
    const etag = `"${versao}"`;

    const nome =
      locale === "es"
        ? "catalogo-pili-industrial-es.pdf"
        : "catalogo-pili-industrial.pdf";
    const cabecalhos = {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nome}"`,
      // Sem cache compartilhado; o navegador revalida pelo ETag.
      "Cache-Control": "private, no-cache",
      ETag: etag,
    };

    if (request.headers.get("if-none-match") === etag) {
      return new NextResponse(null, { status: 304, headers: cabecalhos });
    }

    let gerado = gerados.get(locale);
    if (gerado?.versao !== versao) {
      gerado = {
        versao,
        pdf: gerarPdf(
          produtos,
          settings,
          locale,
          localeDb,
          geradoEm,
          logo,
          logoWhite,
        ),
      };
      gerados.set(locale, gerado);
      // Falha não fica guardada: o pedido seguinte tenta de novo.
      gerado.pdf.catch(() => {
        if (gerados.get(locale)?.versao === versao) gerados.delete(locale);
      });
    }
    const buffer = await gerado.pdf;

    return new NextResponse(new Uint8Array(buffer), { headers: cabecalhos });
  } catch (err) {
    console.error("[CATALOGO_PDF]", err);
    return NextResponse.json(
      { error: "Erro ao gerar o catalogo" },
      { status: 500 },
    );
  }
}

async function gerarPdf(
  produtos: ProdutosDoBanco,
  settings: Awaited<ReturnType<typeof getSiteSettings>>,
  locale: LocaleCatalogo,
  localeDb: "es" | "pt_BR",
  geradoEm: string,
  logo: string,
  logoWhite: string,
): Promise<Buffer> {
  const produtosPdf: ProdutoPdf[] = await Promise.all(
    produtos.map(async (p) => {
      /**
       * Nem todo produto tem versao no idioma pedido — o coletor movel, por
       * exemplo, so foi cadastrado em pt-BR. Cair no pt-BR e melhor do que
       * imprimir o slug no catalogo.
       */
      const t =
        p.translations.find((tr) => tr.locale === localeDb) ??
        p.translations.find((tr) => tr.locale === "pt_BR");
      const features = p.features.filter((f) => f.locale === localeDb);
      const faqs = p.faqs.filter((f) => f.locale === localeDb);
      const fotos = p.media
        .filter((m) => m.type === "image" && fotoUsavel(m.filename))
        .slice(0, FOTOS_POR_PRODUTO);

      const imagens: string[] = [];
      for (const [i, foto] of fotos.entries()) {
        const media = await db.media.findUnique({
          where: { id: foto.id },
          select: { data: true },
        });
        if (!media) continue;
        try {
          imagens.push(await comprimir(media.data, i === 0 ? 1100 : 800));
        } catch (err) {
          console.error("[CATALOGO_PDF] imagem ignorada", foto.filename, err);
        }
      }

      return {
        slug: p.slug,
        category: p.category,
        name: t?.name ?? p.slug,
        tagline: t?.tagline ?? "",
        description: t?.description ?? "",
        specs: p.specs,
        features:
          features.length > 0
            ? features
            : p.features.filter((f) => f.locale === "pt_BR"),
        aplicacoes: p.applications.map((a) => a.slug),
        faqs: (faqs.length > 0
          ? faqs
          : p.faqs.filter((f) => f.locale === "pt_BR")
        ).slice(0, 3),
        imagens,
      };
    }),
  );

  return renderToBuffer(
    CatalogoPdf({
      produtos: produtosPdf,
      locale,
      stats: {
        equipamentos: settings.statsEquipamentos,
        paises: `${settings.statsPaises}`,
        anos: `${new Date().getFullYear() - settings.fundacao}`,
      },
      logoDataUri: logo,
      logoWhiteDataUri: logoWhite,
      contato: {
        telefone: settings.telefone,
        whatsapp: settings.whatsapp,
        email: settings.emailComercial,
        site: "pili.ind.br",
        endereco: settings.endereco,
        razaoSocial: settings.razaoSocial,
        cnpj: settings.cnpj,
      },
      geradoEm,
    }),
  );
}
