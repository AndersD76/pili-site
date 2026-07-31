/**
 * Formatação e cálculo de datas no fuso da operação.
 *
 * O runtime de produção roda em UTC. Sem fixar o fuso, `toLocaleDateString` e
 * `new Date(ano, mês, 1)` usam o relógio do servidor: um lead criado às 21:30
 * de 31/07 (BRT) aparece como 01/08 e cai no mês seguinte nos relatórios.
 */

export const APP_TIME_ZONE = "America/Sao_Paulo";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: APP_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: APP_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** `dd/mm/aaaa` no fuso da operação. */
export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

/** `dd/mm/aaaa hh:mm` no fuso da operação. */
export function formatDateTime(date: Date): string {
  return dateTimeFormatter.format(date);
}

/**
 * Instante em que o mês corrente começou no fuso da operação, expresso em UTC
 * para comparação direta com as colunas `timestamp` do banco.
 */
export function startOfCurrentMonth(now: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? "0");

  const year = get("year");
  const month = get("month");

  // -03:00 é o offset de America/Sao_Paulo (sem horário de verão desde 2019).
  return new Date(
    `${year}-${String(month).padStart(2, "0")}-01T00:00:00.000-03:00`,
  );
}
