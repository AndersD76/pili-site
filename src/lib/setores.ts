import { cache } from "react";
import { getLocale } from "next-intl/server";
import { db } from "./db";
import { logError } from "./prisma-errors";
import { mediaUrl } from "./media";
import type { Locale } from "@prisma/client";

/**
 * Cartões de "Soluções por setor" da home.
 *
 * O painel edita os cinco setores que já existem como rota em
 * `/solucoes/[setor]`; não cria novos, porque um slug inventado viraria um card
 * apontando para 404.
 *
 * Título e descrição são opcionais: sem tradução cadastrada o site usa o texto
 * das mensagens, e sem imagem usa a foto padrão. Editar é melhoria, não
 * requisito.
 */

const LOCALE_PADRAO: Locale = "pt_BR";

function localeDoBanco(locale: string): Locale {
  return locale === "es" ? "es" : LOCALE_PADRAO;
}

export interface SetorData {
  slug: string;
  /** `null` quando ainda não subiram foto: a home usa a imagem padrão. */
  imagem: string | null;
  alt: string | null;
  /** `null` quando não há tradução: a home usa o texto das mensagens. */
  titulo: string | null;
  descricao: string | null;
  /// Textos da pagina /solucoes/[setor]; vazios, a pagina usa as mensagens.
  headline: string | null;
  descricaoLonga: string | null;
}

export const getSetores = cache(async (): Promise<SetorData[]> => {
  let locale: Locale = LOCALE_PADRAO;
  try {
    locale = localeDoBanco(await getLocale());
  } catch {
    // Fora de um contexto de requisição — segue no padrão.
  }

  try {
    const linhas = await db.setor.findMany({
      where: { ativo: true },
      orderBy: { ordem: "asc" },
      include: {
        translations: true,
        media: { orderBy: { order: "asc" }, take: 1 },
      },
    });

    return linhas.map((linha) => {
      const foto = linha.media[0];
      const traducao =
        linha.translations.find((t) => t.locale === locale) ??
        linha.translations.find((t) => t.locale === LOCALE_PADRAO);

      return {
        slug: linha.slug,
        imagem: foto ? mediaUrl(foto.id) : null,
        alt: foto?.alt ?? null,
        titulo: traducao?.titulo ?? null,
        descricao: traducao?.descricao ?? null,
        headline: traducao?.headline ?? null,
        descricaoLonga: traducao?.descricaoLonga ?? null,
      };
    });
  } catch (err) {
    logError("SETORES", err);
    return [];
  }
});

/** Todos os setores, inclusive inativos — usado só pelo painel. */
export async function getSetoresAdmin() {
  return db.setor.findMany({
    orderBy: { ordem: "asc" },
    include: {
      translations: true,
      media: { orderBy: { order: "asc" } },
    },
  });
}
