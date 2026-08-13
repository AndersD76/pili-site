/**
 * Recomendação de tombador a partir da operação do cliente.
 *
 * A versão anterior devolvia quatro modelos escritos no código — "PILI T-9000",
 * "T-15000", "T-22000", "T-30000" — que não existem no catálogo. Agora a
 * recomendação sai dos produtos cadastrados no painel, com as specs reais de
 * capacidade, comprimento e ciclo.
 *
 * O que decide o modelo não é a tonelagem diária: é o **veículo**. A plataforma
 * precisa comportar o comprimento do conjunto e suportar seu peso bruto. A
 * tonelagem entra depois, para conferir se o ciclo do equipamento dá conta do
 * volume dentro da jornada.
 */

export type TipoVeiculo = "caminhao" | "carreta" | "bitrem" | "rodotrem";

export type TipoProduto =
  | "soja"
  | "milho"
  | "trigo"
  | "fertilizante"
  | "cimento";

/**
 * Referências do transporte rodoviário brasileiro.
 *
 * Comprimento e PBTC (peso bruto total combinado) seguem os limites do CONTRAN
 * para cada configuração. O volume é o de um graneleiro típico da categoria e
 * serve só para estimar a tonelagem; o cliente pode ter carroceria diferente.
 */
export const VEICULOS: Record<
  TipoVeiculo,
  { comprimentoM: number; pbtcT: number; volumeM3: number }
> = {
  caminhao: { comprimentoM: 12, pbtcT: 29, volumeM3: 20 },
  carreta: { comprimentoM: 18.6, pbtcT: 48.5, volumeM3: 30 },
  bitrem: { comprimentoM: 19.8, pbtcT: 57, volumeM3: 45 },
  rodotrem: { comprimentoM: 30, pbtcT: 74, volumeM3: 60 },
};

/** Densidade aparente a granel, em t/m³. */
export const DENSIDADE: Record<TipoProduto, number> = {
  soja: 0.75,
  milho: 0.72,
  trigo: 0.78,
  fertilizante: 1.1,
  cimento: 1.5,
};

/**
 * Tempo de posicionamento entre um veículo e o seguinte.
 *
 * O ciclo que vem da ficha do produto é só o tombamento. Entrar na plataforma,
 * travar as rodas, destravar e sair leva mais tempo que isso, e ignorar essa
 * parcela produziria uma vazão que nenhuma operação alcança. Três minutos é uma
 * estimativa conservadora, exibida ao usuário para ele poder discordar.
 */
export const MANOBRA_S = 180;

export interface Tombador {
  slug: string;
  nome: string;
  categoria: string;
  capacidadeT: number;
  comprimentoM: number;
  cicloS: number;
}

/**
 * Extrai o número de uma spec escrita para leitura humana.
 *
 * As fichas trazem "45 t", "10.000 mm", "~60 s". O separador de milhar é ponto
 * e o decimal é vírgula, então a conversão não pode usar `parseFloat` direto:
 * "10.000" viraria 10.
 */
export function numeroDaSpec(valor: string): number | null {
  const limpo = valor
    .replace(/[~≈]/g, "")
    .replace(/\.(?=\d{3}\b)/g, "")
    .replace(",", ".");

  const achado = limpo.match(/-?\d+(\.\d+)?/);
  if (!achado) return null;

  const n = Number(achado[0]);
  return Number.isFinite(n) ? n : null;
}

/** Monta um tombador a partir das specs; devolve `null` se faltar alguma. */
export function tombadorDeSpecs(entrada: {
  slug: string;
  nome: string;
  categoria: string;
  specs: { key: string; value: string }[];
}): Tombador | null {
  const spec = (nome: string) =>
    entrada.specs.find((s) => s.key.toLowerCase().startsWith(nome))?.value;

  const capacidade = spec("capacidade");
  const comprimento = spec("comprimento");
  const ciclo = spec("ciclo");
  if (!capacidade || !comprimento || !ciclo) return null;

  const capacidadeT = numeroDaSpec(capacidade);
  const comprimentoMm = numeroDaSpec(comprimento);
  const cicloS = numeroDaSpec(ciclo);
  if (capacidadeT === null || comprimentoMm === null || cicloS === null) {
    return null;
  }

  return {
    slug: entrada.slug,
    nome: entrada.nome,
    categoria: entrada.categoria,
    capacidadeT,
    comprimentoM: comprimentoMm / 1000,
    cicloS,
  };
}

export interface Recomendacao {
  tombador: Tombador;
  /** Nenhum modelo do catálogo atende ao veículo informado. */
  acimaDoCatalogo: boolean;
  veiculo: (typeof VEICULOS)[TipoVeiculo];
  /** Toneladas por veículo carregado. */
  toneladasPorVeiculo: number;
  /** Toneladas por dia na operação informada. */
  toneladasPorDia: number;
  /** Veículos que o equipamento descarrega por hora. */
  veiculosPorHora: number;
  /** Horas necessárias para escoar a fila do dia. */
  horasNecessarias: number;
  /** A jornada informada comporta o volume? */
  cabeNaJornada: boolean;
}

/**
 * Escolhe o menor tombador que atende ao veículo.
 *
 * Menor de propósito: equipamento sobrando é dinheiro parado, e o cliente que
 * quiser folga consegue enxergá-la nas alternativas exibidas ao lado.
 *
 * Quando nenhum modelo comporta o veículo, devolve o maior do catálogo com
 * `acimaDoCatalogo`, para a tela dizer que o caso é de projeto especial em vez
 * de recomendar algo insuficiente em silêncio.
 */
export function recomendar(
  tombadores: Tombador[],
  entrada: {
    veiculo: TipoVeiculo;
    produto: TipoProduto;
    veiculosPorDia: number;
    horasPorDia: number;
  },
): Recomendacao | null {
  if (tombadores.length === 0) return null;

  const veiculo = VEICULOS[entrada.veiculo];

  const porTamanho = [...tombadores].sort(
    (a, b) => a.comprimentoM - b.comprimentoM || a.capacidadeT - b.capacidadeT,
  );

  const atendem = porTamanho.filter(
    (t) =>
      t.comprimentoM >= veiculo.comprimentoM && t.capacidadeT >= veiculo.pbtcT,
  );

  const acimaDoCatalogo = atendem.length === 0;
  const tombador = atendem[0] ?? porTamanho[porTamanho.length - 1];
  if (!tombador) return null;

  const toneladasPorVeiculo = veiculo.volumeM3 * DENSIDADE[entrada.produto];
  const toneladasPorDia = toneladasPorVeiculo * entrada.veiculosPorDia;

  const veiculosPorHora = 3600 / (tombador.cicloS + MANOBRA_S);
  const horasNecessarias =
    veiculosPorHora > 0 ? entrada.veiculosPorDia / veiculosPorHora : Infinity;

  return {
    tombador,
    acimaDoCatalogo,
    veiculo,
    toneladasPorVeiculo,
    toneladasPorDia,
    veiculosPorHora,
    horasNecessarias,
    cabeNaJornada: horasNecessarias <= entrada.horasPorDia,
  };
}
