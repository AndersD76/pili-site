import { cache } from "react";
import { db } from "./db";
import { logError } from "./prisma-errors";
import { tombadorDeSpecs, type Tombador } from "./calculadora";

/**
 * Tombadores do catálogo, prontos para a calculadora.
 *
 * Fica separado de `calculadora.ts` de propósito: aquele módulo é puro e roda
 * nos testes sem banco.
 *
 * Produto sem capacidade, comprimento ou ciclo na ficha é descartado — entrar
 * na comparação com spec faltando produziria recomendação errada, e um modelo
 * de menos é melhor que um modelo mal dimensionado.
 */
export const getTombadoresCalculadora = cache(async (): Promise<Tombador[]> => {
  try {
    const produtos = await db.product.findMany({
      where: {
        active: true,
        category: { in: ["TOMBADOR_FIXO", "TOMBADOR_MOVEL"] },
      },
      orderBy: { order: "asc" },
      include: {
        translations: { where: { locale: "pt_BR" }, select: { name: true } },
        specs: { select: { key: true, value: true } },
      },
    });

    return produtos
      .map((p) =>
        tombadorDeSpecs({
          slug: p.slug,
          nome: p.translations[0]?.name ?? p.slug,
          categoria: p.category,
          specs: p.specs,
        }),
      )
      .filter((t): t is Tombador => t !== null);
  } catch (err) {
    logError("CALCULADORA_TOMBADORES", err);
    return [];
  }
});
