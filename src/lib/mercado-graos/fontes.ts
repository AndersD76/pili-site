import { META } from "./dados";
import { data } from "./formato";

/**
 * Carimbos de fonte exibidos em cada bloco de dado.
 *
 * As datas saem do próprio retrato: a da Conab é o Last-Modified do arquivo
 * público, a do IBGE é o ano da safra. Nada escrito à mão.
 */
export const FONTE_CONAB = {
  nome: "Conab — Cadastro Nacional de Unidades Armazenadoras (SICARM)",
  url: "https://portaldeinformacoes.conab.gov.br/armazenagem",
  data: `atualizado em ${data(META.conab.atualizadoEm)}`,
};

export const FONTE_IBGE = {
  nome: `IBGE — Produção Agrícola Municipal ${META.ibge.ano}`,
  url: `https://sidra.ibge.gov.br/tabela/${META.ibge.tabela}`,
  data: `safra ${META.ibge.ano}`,
};

export const FONTES_DATASET = [
  { nome: "Conab — SICARM", url: FONTE_CONAB.url },
  { nome: `IBGE — PAM ${META.ibge.ano}`, url: FONTE_IBGE.url },
];

/** Data mais recente entre as fontes — vira o `lastmod` e o `dateModified`. */
export const ATUALIZADO_EM = META.conab.atualizadoEm;

export const ANO = META.ibge.ano;
export const ANO_ANTERIOR = META.ibge.anoAnterior;
