import type { Cultura } from "./dados";

/** Rótulos das culturas como aparecem no texto. */
export const NOME_CULTURA: Record<Cultura, string> = {
  soja: "soja",
  milho: "milho",
  trigo: "trigo",
  arroz: "arroz",
  feijao: "feijão",
};

export const TITULO_CULTURA: Record<Cultura, string> = {
  soja: "Soja",
  milho: "Milho",
  trigo: "Trigo",
  arroz: "Arroz",
  feijao: "Feijão",
};

const inteiro = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const umaCasa = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const duasCasas = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function num(n: number): string {
  return inteiro.format(n);
}

/**
 * Medida técnica com a casa decimal que ela tiver: 19,8 m continua 19,8 m.
 * `num` arredonda para inteiro, e um bitrem de 19,8 m virava "20 m" — número
 * errado numa página que promete dimensão de norma.
 */
export function medida(n: number): string {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(n);
}

const MINUSCULAS = new Set(["de", "da", "do", "das", "dos", "e", "em", "para"]);

/**
 * Nome de empresa como se lê, não como o cadastro grava.
 *
 * A Conab registra tudo em caixa alta ("COAMO AGROINDUSTRIAL COOPERATIVA").
 * Em título de busca isso parece grito e costuma ser reescrito pelo Google.
 * Siglas e termos com ponto, barra ou número ficam como estão (S/A, C.VALE).
 */
export function nomeEmpresa(nome: string): string {
  return nome
    .split(/(\s+|-)/)
    .map((parte, i) => {
      if (!/[A-Za-zÀ-ÿ]/.test(parte)) return parte;
      const baixo = parte.toLocaleLowerCase("pt-BR");
      // Preposição antes da regra de sigla: "DE" é preposição, não sigla.
      if (i > 0 && MINUSCULAS.has(baixo)) return baixo;
      if (/[./\d&]/.test(parte) || parte.length <= 2) return parte;
      return baixo.charAt(0).toLocaleUpperCase("pt-BR") + baixo.slice(1);
    })
    .join("");
}

/** Toneladas em extenso curto: "4,36 milhões de t", "85,2 mil t", "940 t". */
export function toneladas(t: number): string {
  const abs = Math.abs(t);
  if (abs >= 1_000_000) return `${duasCasas.format(t / 1_000_000)} milhões de t`;
  if (abs >= 1_000) return `${umaCasa.format(t / 1_000)} mil t`;
  return `${inteiro.format(t)} t`;
}

/** Versão compacta para títulos: "4,36 mi t". */
export function toneladasCurto(t: number): string {
  const abs = Math.abs(t);
  if (abs >= 1_000_000) return `${duasCasas.format(t / 1_000_000)} mi t`;
  if (abs >= 1_000) return `${umaCasa.format(t / 1_000)} mil t`;
  return `${inteiro.format(t)} t`;
}

export function pct(fracao: number, casas = 0): string {
  return `${new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: casas,
  }).format(fracao * 100)}%`;
}

/** "+12%" / "-3%" para variação de um ano para o outro. */
export function variacao(atual: number, anterior: number | null): string | null {
  if (!anterior) return null;
  const v = (atual - anterior) / anterior;
  const sinal = v > 0 ? "+" : "";
  return `${sinal}${pct(v)}`;
}

export function data(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Sacas de 60 kg em toneladas. */
export function sacasParaT(sacas: number): number {
  return (sacas * 60) / 1000;
}
