import { unstable_cache } from "next/cache";
import {
  DENSIDADE,
  MANOBRA_S,
  VEICULOS,
  tombadorDeSpecs,
  type TipoVeiculo,
  type Tombador,
} from "@/lib/calculadora";
import { db } from "@/lib/db";
import { PRODUTO_PUBLICAVEL } from "@/lib/produto-publicavel";
import type { Cultura } from "./dados";

/**
 * Cenários de logística da safra.
 *
 * Nada aqui é dado da Conab ou do IBGE: é conta em cima deles, com premissas
 * que a página mostra junto do resultado para o leitor poder discordar —
 * janela de colheita, jornada e veículo. É a mesma conta da calculadora do
 * site, para os números não brigarem entre si.
 */

/**
 * Densidade aparente a granel, em t/m³.
 *
 * Soja, milho e trigo vêm da calculadora. Arroz em casca e feijão não existiam
 * lá; os valores abaixo são referências usuais de engenharia de armazenagem e
 * aparecem na página como referência, não como medição.
 */
export const DENSIDADE_CULTURA: Record<Cultura, number> = {
  soja: DENSIDADE.soja,
  milho: DENSIDADE.milho,
  trigo: DENSIDADE.trigo,
  arroz: 0.58,
  feijao: 0.77,
};

export const NOME_VEICULO: Record<TipoVeiculo, string> = {
  caminhao: "caminhão toco/truck",
  carreta: "carreta",
  bitrem: "bitrem",
  rodotrem: "rodotrem",
};

/** Janelas de colheita comparadas nas páginas, em dias. */
export const JANELAS = [30, 45, 60] as const;

/** Jornada de recepção considerada nos cenários, em horas por dia. */
export const JORNADA_H = 20;

export function toneladasPorViagem(cultura: Cultura, veiculo: TipoVeiculo): number {
  return VEICULOS[veiculo].volumeM3 * DENSIDADE_CULTURA[cultura];
}

export interface Cenario {
  dias: number;
  toneladasDia: number;
  caminhoesDia: number;
  caminhoesHora: number;
}

/** Quantos veículos por dia para receber `toneladas` em cada janela. */
export function cenariosDeRecepcao(
  toneladas: number,
  cultura: Cultura,
  veiculo: TipoVeiculo,
): Cenario[] {
  const porViagem = toneladasPorViagem(cultura, veiculo);
  return JANELAS.map((dias) => {
    const toneladasDia = toneladas / dias;
    const caminhoesDia = toneladasDia / porViagem;
    return {
      dias,
      toneladasDia,
      caminhoesDia,
      caminhoesHora: caminhoesDia / JORNADA_H,
    };
  });
}

/**
 * Tombadores publicados no catálogo, com as specs necessárias para a conta.
 *
 * Usa a mesma regra de publicação do site (`PRODUTO_PUBLICAVEL`), para a
 * página nunca recomendar um modelo cujo link daria 404. Consulta o banco
 * direto em vez de `getProdutos`, que depende do idioma da requisição — algo
 * que não pode ser lido dentro de um cache compartilhado. Fica em cache por
 * uma hora: são milhares de páginas estáticas e o catálogo muda raramente.
 */
/** Tag do cache dos tombadores — as actions de produto chamam `updateTag` com ela. */
export const TAG_TOMBADORES = "produtos";

export const tombadoresPublicados = unstable_cache(
  async (): Promise<Tombador[]> => {
    try {
      const produtos = await db.product.findMany({
        where: {
          ...PRODUTO_PUBLICAVEL,
          category: { in: ["TOMBADOR_FIXO", "TOMBADOR_MOVEL"] },
        },
        orderBy: { order: "asc" },
        select: {
          slug: true,
          category: true,
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
    } catch {
      return [];
    }
  },
  ["mercado-graos-tombadores"],
  { revalidate: 3600, tags: [TAG_TOMBADORES] },
);

/** Veículos que um tombador descarrega por hora, com a manobra incluída. */
export function veiculosPorHora(t: Tombador): number {
  return 3600 / (t.cicloS + MANOBRA_S);
}

/**
 * O menor tombador fixo que comporta o veículo — mesma regra da calculadora.
 * `null` quando nenhum modelo do catálogo atende.
 */
export function tombadorParaVeiculo(
  tombadores: Tombador[],
  veiculo: TipoVeiculo,
): Tombador | null {
  const v = VEICULOS[veiculo];
  return (
    [...tombadores]
      .filter((t) => t.categoria === "TOMBADOR_FIXO")
      .sort((a, b) => a.comprimentoM - b.comprimentoM || a.capacidadeT - b.capacidadeT)
      .find((t) => t.comprimentoM >= v.comprimentoM && t.capacidadeT >= v.pbtcT) ?? null
  );
}
