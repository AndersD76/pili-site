import { cache } from "react";
import { getLocale } from "next-intl/server";
import { db } from "./db";
import { logError } from "./prisma-errors";
import { mediaUrl } from "./media";
import type { Locale } from "@prisma/client";

/**
 * Slides do carrossel do hero da home.
 *
 * A imagem vem da biblioteca de mídia pelo mesmo `MediaUploader` de produtos,
 * obras e artigos: a primeira foto do slide é o fundo.
 */

const LOCALE_PADRAO: Locale = "pt_BR";

/** O enum do Prisma usa `pt_BR`; a rota usa `pt-BR`. */
function localeDoBanco(locale: string): Locale {
  return locale === "es" ? "es" : LOCALE_PADRAO;
}

export interface SlideData {
  id: string;
  imagem: string;
  alt: string;
  titulo: string;
  subtitulo: string | null;
}

/**
 * Slides prontos para renderizar, no idioma da requisição.
 *
 * Slide sem imagem é descartado: ele viraria um painel preto no meio do
 * carrossel. Slide sem tradução no idioma pedido cai para o português, mesma
 * regra dos demais conteúdos do CMS.
 */
export const getHeroSlides = cache(async (): Promise<SlideData[]> => {
  let locale: Locale = LOCALE_PADRAO;
  try {
    locale = localeDoBanco(await getLocale());
  } catch {
    // Fora de um contexto de requisição — segue no padrão.
  }

  try {
    const linhas = await db.heroSlide.findMany({
      where: { ativo: true },
      orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
      include: {
        translations: true,
        media: { orderBy: { order: "asc" }, take: 1 },
      },
    });

    const slides: SlideData[] = [];

    for (const linha of linhas) {
      const foto = linha.media[0];
      if (!foto) continue;

      const traducao =
        linha.translations.find((t) => t.locale === locale) ??
        linha.translations.find((t) => t.locale === LOCALE_PADRAO);
      if (!traducao) continue;

      slides.push({
        id: linha.id,
        imagem: mediaUrl(foto.id),
        alt: foto.alt ?? traducao.titulo,
        titulo: traducao.titulo,
        subtitulo: traducao.subtitulo,
      });
    }

    return slides;
  } catch (err) {
    logError("HERO_SLIDES", err);
    return [];
  }
});

/** Todos os slides, inclusive inativos e sem imagem — usado só pelo painel. */
export async function getHeroSlidesAdmin() {
  return db.heroSlide.findMany({
    orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
    include: {
      translations: true,
      media: { orderBy: { order: "asc" } },
    },
  });
}
