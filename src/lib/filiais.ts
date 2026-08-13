import { cache } from "react";
import { db } from "./db";
import { logError } from "./prisma-errors";
import type { FilialTipo } from "@prisma/client";

/**
 * Unidades da PILI além da matriz.
 *
 * A matriz não vive aqui: ela continua vindo de `SiteSettings`, fonte única do
 * endereço de Erechim. Este módulo cuida só das demais unidades, cadastradas
 * pelo painel em `/admin/filiais`.
 */

export interface FilialData {
  id: string;
  nome: string;
  tipo: FilialTipo;
  cidade: string;
  uf: string;
  endereco: string;
  cep: string | null;
  telefone: string | null;
  lat: number | null;
  lng: number | null;
}

/**
 * Unidades ativas, na ordem de exibição.
 *
 * Falha de banco devolve lista vazia em vez de derrubar a página: o rodapé
 * aparece em todo o site, e uma consulta indisponível não pode tirar o site do
 * ar por causa de um bloco secundário.
 */
export const getFiliais = cache(async (): Promise<FilialData[]> => {
  try {
    return await db.filial.findMany({
      where: { ativa: true },
      orderBy: [{ ordem: "asc" }, { cidade: "asc" }],
      select: {
        id: true,
        nome: true,
        tipo: true,
        cidade: true,
        uf: true,
        endereco: true,
        cep: true,
        telefone: true,
        lat: true,
        lng: true,
      },
    });
  } catch (err) {
    logError("FILIAIS", err);
    return [];
  }
});

/** Todas as unidades, inclusive inativas — usado só pelo painel. */
export async function getFiliaisAdmin() {
  return db.filial.findMany({
    orderBy: [{ ordem: "asc" }, { cidade: "asc" }],
  });
}

/** Ponto plotável no mapa. Unidade sem coordenada fica só como endereço. */
export interface PontoMapa {
  nome: string;
  endereco: string;
  lat: number;
  lng: number;
  matriz: boolean;
}

/**
 * Junta matriz e filiais num único conjunto de pontos.
 *
 * Só entra quem tem coordenada preenchida: um ponto sem `lat`/`lng` no mapa
 * cairia na ilha Null, no golfo da Guiné.
 */
export function pontosDoMapa(
  matriz: { endereco: string; lat: number | null; lng: number | null },
  filiais: FilialData[],
  nomeMatriz: string,
): PontoMapa[] {
  const pontos: PontoMapa[] = [];

  if (matriz.lat !== null && matriz.lng !== null) {
    pontos.push({
      nome: nomeMatriz,
      endereco: matriz.endereco,
      lat: matriz.lat,
      lng: matriz.lng,
      matriz: true,
    });
  }

  for (const f of filiais) {
    if (f.lat === null || f.lng === null) continue;
    pontos.push({
      nome: f.nome,
      endereco: `${f.endereco} — ${f.cidade}/${f.uf}`,
      lat: f.lat,
      lng: f.lng,
      matriz: false,
    });
  }

  return pontos;
}
