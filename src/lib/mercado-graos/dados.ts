import metaJson from "@/data/seo/meta.json";
import brasilJson from "@/data/seo/brasil.json";
import ufsJson from "@/data/seo/ufs.json";
import municipiosJson from "@/data/seo/municipios.json";
import empresasJson from "@/data/seo/empresas.json";
import portesJson from "@/data/seo/portes.json";

/**
 * Base das páginas de mercado de grãos.
 *
 * Tudo aqui vem do retrato gerado por scripts/seo/atualizar-base.mjs a partir
 * da Conab e do IBGE. As páginas nunca consultam essas fontes: se uma delas
 * sair do ar, o site continua publicando o último retrato — e a data de cada
 * fonte aparece na página, então ninguém confunde dado antigo com atual.
 *
 * As listas já chegam filtradas pelo gate de qualidade do script: entidade que
 * não passou nem entra aqui, portanto não vira página nem entra no sitemap.
 */

export type Cultura = "soja" | "milho" | "trigo" | "arroz" | "feijao";

export const CULTURAS: Cultura[] = ["soja", "milho", "trigo", "arroz", "feijao"];

export interface DadoCultura {
  t: number;
  tAnterior: number | null;
  ha: number | null;
  kgHa: number | null;
  pagina: boolean;
}

export interface Armazenagem {
  unidades: number;
  juridicas: number;
  fisicas: number;
  granel: number;
  convencional: number;
  cooperativas: number;
  privadas: number;
  oficiais: number;
  estatica: number;
}

export interface Municipio {
  cod: string;
  nome: string;
  slug: string;
  uf: string;
  micro: { id: number; nome: string };
  producaoT: number;
  culturas: Partial<Record<Cultura, DadoCultura>>;
  armazenagem: Armazenagem;
  empresas: {
    nome: string;
    slug: string | null;
    unidades: number;
    estatica: number;
  }[];
}

export interface Uf {
  sigla: string;
  slug: string;
  nome: string;
  regiao: string;
  producaoT: number;
  culturas: Partial<
    Record<Cultura, { t: number; tAnterior: number; ha: number; pagina: boolean }>
  >;
  armazenagem: Armazenagem;
  municipiosComPagina: number;
}

export interface Empresa extends Armazenagem {
  slug: string;
  nome: string;
  ufs: string[];
  municipios: {
    cod: string;
    nome: string;
    uf: string;
    unidades: number;
    estatica: number;
  }[];
}

export const META = metaJson as {
  geradoEm: string;
  conab: { url: string; atualizadoEm: string };
  ibge: { tabela: number; pesquisa: string; ano: number; anoAnterior: number };
  totais: Record<string, number>;
};
export const BRASIL = brasilJson as {
  producaoT: number;
  armazenagem: Armazenagem;
  municipiosProdutores: number;
};
export const UFS = ufsJson as Uf[];
export const MUNICIPIOS = municipiosJson as Municipio[];
export const EMPRESAS = empresasJson as Empresa[];

export interface Porte {
  sacas: number;
  t: number;
  armazensParecidos: number;
  granel: number;
  cooperativas: number;
  fisicas: number;
  municipiosComDeficitMaior: number;
}
export const PORTES = portesJson as Porte[];

/** "50-mil-sacas" ↔ 50000. */
export function slugPorte(sacas: number): string {
  return `${sacas / 1000}-mil-sacas`;
}
export function buscarPorte(slug: string): Porte | undefined {
  return PORTES.find((p) => slugPorte(p.sacas) === slug);
}

// ---------------------------------------------------------------- índices

const municipioPorChave = new Map(
  MUNICIPIOS.map((m) => [`${m.uf.toLowerCase()}/${m.slug}`, m]),
);
const municipioPorCod = new Map(MUNICIPIOS.map((m) => [m.cod, m]));
const ufPorSlug = new Map(UFS.map((u) => [u.slug, u]));
const empresaPorSlug = new Map(EMPRESAS.map((e) => [e.slug, e]));

export function buscarUf(slug: string): Uf | undefined {
  return ufPorSlug.get(slug.toLowerCase());
}

export function buscarMunicipio(uf: string, slug: string): Municipio | undefined {
  return municipioPorChave.get(`${uf.toLowerCase()}/${slug}`);
}

export function municipioPorCodigo(cod: string): Municipio | undefined {
  return municipioPorCod.get(cod);
}

export function buscarEmpresa(slug: string): Empresa | undefined {
  return empresaPorSlug.get(slug);
}

export function municipiosDaUf(sigla: string): Municipio[] {
  return MUNICIPIOS.filter((m) => m.uf === sigla);
}

/** Vizinhos de microrregião que também têm página — nunca link para 404. */
export function vizinhos(m: Municipio, limite = 12): Municipio[] {
  return MUNICIPIOS.filter(
    (o) => o.micro.id === m.micro.id && o.cod !== m.cod,
  ).slice(0, limite);
}

/** Saldo positivo = sobra armazém; negativo = falta. */
export function saldo(producaoT: number, estatica: number): number {
  return estatica - producaoT;
}

/** Parte da safra que cabe nos armazéns do lugar, de 0 a 1 (ou mais). */
export function cobertura(producaoT: number, estatica: number): number {
  return producaoT > 0 ? estatica / producaoT : 0;
}

/** Posição (1 = maior) de um valor dentro de uma lista. */
export function posicao<T>(lista: T[], item: T, valor: (x: T) => number): number {
  const ordenada = [...lista].sort((a, b) => valor(b) - valor(a));
  return ordenada.indexOf(item) + 1;
}

export function municipiosComCultura(cultura: Cultura, uf?: string): Municipio[] {
  return MUNICIPIOS.filter(
    (m) => m.culturas[cultura]?.pagina && (!uf || m.uf === uf),
  ).sort((a, b) => (b.culturas[cultura]?.t ?? 0) - (a.culturas[cultura]?.t ?? 0));
}

export function producaoBrasil(cultura: Cultura): number {
  return UFS.reduce((s, u) => s + (u.culturas[cultura]?.t ?? 0), 0);
}
