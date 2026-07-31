import { describe, it, expect } from "vitest";
import { formatDate, formatDateTime, startOfCurrentMonth } from "./datetime";

/**
 * O runtime de produção roda em UTC. Sem fixar o fuso, um lead criado às 21:30
 * BRT de 31/07 era gravado como 00:30 UTC de 01/08 e exibido como 01/08 para o
 * time comercial — erro sistemático de um dia para tudo criado após 21:00.
 */
describe("formatação no fuso da operação", () => {
  it("mostra o dia correto para um instante da noite brasileira", () => {
    // 2026-08-01T00:30:00Z == 2026-07-31 21:30 em America/Sao_Paulo
    const noite = new Date("2026-08-01T00:30:00.000Z");
    expect(formatDate(noite)).toBe("31/07/2026");
  });

  it("mostra hora local, não UTC", () => {
    const noite = new Date("2026-08-01T00:30:00.000Z");
    expect(formatDateTime(noite)).toBe("31/07/2026, 21:30");
  });

  it("usa o formato brasileiro dd/mm/aaaa", () => {
    expect(formatDate(new Date("2026-03-09T15:00:00.000Z"))).toBe("09/03/2026");
  });
});

describe("startOfCurrentMonth", () => {
  it("começa o mês às 00:00 do fuso local, não em UTC", () => {
    const meio = new Date("2026-07-15T12:00:00.000Z");
    // 00:00 de 01/07 em BRT (-03:00) == 03:00Z de 01/07
    expect(startOfCurrentMonth(meio).toISOString()).toBe(
      "2026-07-01T03:00:00.000Z",
    );
  });

  it("na virada do mês em BRT, ainda considera o mês anterior", () => {
    // 2026-08-01T01:00:00Z == 2026-07-31 22:00 BRT: ainda é julho
    const virada = new Date("2026-08-01T01:00:00.000Z");
    expect(startOfCurrentMonth(virada).toISOString()).toBe(
      "2026-07-01T03:00:00.000Z",
    );
  });
});
