import { cache } from "react";
import { getLocale } from "next-intl/server";
import { db } from "./db";
import { logError } from "./prisma-errors";
import { mediaUrl } from "./media";
import type { Locale } from "@prisma/client";

/**
 * Trechos do site que o painel edita: a trajetória de /empresa e os blocos de
 * seção com imagem e texto.
 *
 * A regra é a mesma em todos: vazio no banco significa "usar o texto das
 * mensagens". Editar é melhoria, não requisito, e nenhuma tela quebra por falta
 * de cadastro.
 */

const LOCALE_PADRAO: Locale = "pt_BR";

function localeDoBanco(locale: string): Locale {
  return locale === "es" ? "es" : LOCALE_PADRAO;
}

async function localeAtual(): Promise<Locale> {
  try {
    return localeDoBanco(await getLocale());
  } catch {
    return LOCALE_PADRAO;
  }
}

/* ------------------------------------------------ linha do tempo */

export interface MarcoData {
  id: string;
  ano: string | null;
  titulo: string;
  texto: string;
}

/**
 * Marcos da trajetória, no idioma da requisição.
 *
 * Lista vazia significa "nenhum marco cadastrado": a página de empresa cai na
 * linha do tempo das mensagens.
 */
export const getMarcosHistoria = cache(async (): Promise<MarcoData[]> => {
  const locale = await localeAtual();

  try {
    const linhas = await db.marcoHistoria.findMany({
      where: { ativo: true },
      orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
      include: { translations: true },
    });

    const marcos: MarcoData[] = [];
    for (const linha of linhas) {
      const traducao =
        linha.translations.find((t) => t.locale === locale) ??
        linha.translations.find((t) => t.locale === LOCALE_PADRAO);
      if (!traducao) continue;

      marcos.push({
        id: linha.id,
        ano: linha.ano,
        titulo: traducao.titulo,
        texto: traducao.texto,
      });
    }
    return marcos;
  } catch (err) {
    logError("MARCOS_HISTORIA", err);
    return [];
  }
});

/** Todos os marcos, inclusive inativos — usado só pelo painel. */
export async function getMarcosHistoriaAdmin() {
  return db.marcoHistoria.findMany({
    orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
    include: { translations: true },
  });
}

/* ------------------------------------------------ blocos de seção */

export interface BlocoData {
  chave: string;
  imagem: string | null;
  alt: string | null;
  titulo: string | null;
  subtitulo: string | null;
  texto: string | null;
}

/**
 * Bloco de seção pela chave.
 *
 * Devolve `null` só quando o bloco não existe. Um bloco existente sem texto
 * devolve campos nulos, e quem chama decide o fallback.
 */
export const getBloco = cache(
  async (chave: string): Promise<BlocoData | null> => {
    const locale = await localeAtual();

    try {
      const linha = await db.blocoConteudo.findUnique({
        where: { chave },
        include: {
          translations: true,
          media: { orderBy: { order: "asc" }, take: 1 },
        },
      });
      if (!linha || !linha.ativo) return null;

      const foto = linha.media[0];
      const traducao =
        linha.translations.find((t) => t.locale === locale) ??
        linha.translations.find((t) => t.locale === LOCALE_PADRAO);

      return {
        chave: linha.chave,
        imagem: foto ? mediaUrl(foto.id) : null,
        alt: foto?.alt ?? null,
        titulo: traducao?.titulo ?? null,
        subtitulo: traducao?.subtitulo ?? null,
        texto: traducao?.texto ?? null,
      };
    } catch (err) {
      logError("BLOCO_CONTEUDO", err);
      return null;
    }
  },
);

/** Bloco com todas as traduções e mídias — usado só pelo painel. */
export async function getBlocoAdmin(chave: string) {
  return db.blocoConteudo.findUnique({
    where: { chave },
    include: {
      translations: true,
      media: { orderBy: { order: "asc" } },
    },
  });
}
