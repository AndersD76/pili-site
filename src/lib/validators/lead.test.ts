import { describe, it, expect } from "vitest";
import {
  leadRequestSchema,
  catalogFormSchema,
  calculatorGateSchema,
  jobApplicationFormSchema,
  LEAD_SOURCES,
} from "./lead";

/**
 * Estes testes existem por causa de dois defeitos reais encontrados em
 * auditoria: os formulários de catálogo e calculadora enviavam `phone: "N/A"`
 * (3 caracteres, reprovado por `min(8)`) e "Trabalhe conosco" enviava um
 * `source` que não existia no enum. Ambos respondiam HTTP 400 em produção e
 * nenhum teste acusava.
 */

const leadBase = {
  name: "Maria Silva",
  email: "maria@cooperativa.com.br",
  company: "Cooperativa Central",
  country: "BR",
  consent: true as const,
};

describe("leadRequestSchema", () => {
  it("aceita o payload do formulário completo", () => {
    const r = leadRequestSchema.safeParse({
      ...leadBase,
      phone: "5499999000",
      source: "FORMULARIO",
    });
    expect(r.success).toBe(true);
  });

  it("aceita payload sem telefone (gates de catálogo e calculadora)", () => {
    const r = leadRequestSchema.safeParse({ ...leadBase, source: "CATALOGO" });
    expect(r.success).toBe(true);
  });

  it("rejeita telefone curto em vez de aceitar um marcador como N/A", () => {
    const r = leadRequestSchema.safeParse({ ...leadBase, phone: "N/A" });
    expect(r.success).toBe(false);
  });

  it("aceita TRABALHE_CONOSCO como origem", () => {
    const r = leadRequestSchema.safeParse({
      ...leadBase,
      phone: "5499999000",
      source: "TRABALHE_CONOSCO",
    });
    expect(r.success).toBe(true);
  });

  it("rejeita origem fora do enum", () => {
    const r = leadRequestSchema.safeParse({ ...leadBase, source: "INVENTADA" });
    expect(r.success).toBe(false);
  });

  it("usa FORMULARIO como origem padrão", () => {
    const r = leadRequestSchema.parse(leadBase);
    expect(r.source).toBe("FORMULARIO");
  });

  it("exige consentimento explícito", () => {
    const r = leadRequestSchema.safeParse({ ...leadBase, consent: false });
    expect(r.success).toBe(false);
  });

  it("rejeita país fora do formato ISO alpha-2", () => {
    expect(leadRequestSchema.safeParse({ ...leadBase, country: "BRA" }).success).toBe(false);
    expect(leadRequestSchema.safeParse({ ...leadBase, country: "ZZ" }).success).toBe(true);
  });

  it("aceita utm como mapa de strings e rejeita escalar", () => {
    expect(
      leadRequestSchema.safeParse({ ...leadBase, utm: { source: "google" } }).success,
    ).toBe(true);
    expect(leadRequestSchema.safeParse({ ...leadBase, utm: "google" }).success).toBe(false);
  });
});

describe("schemas por formulário", () => {
  it("catálogo não exige telefone", () => {
    expect(catalogFormSchema.safeParse(leadBase).success).toBe(true);
  });

  it("gate da calculadora exige e-mail e consentimento", () => {
    expect(
      calculatorGateSchema.safeParse({ email: "a@b.com", consent: true }).success,
    ).toBe(true);
    expect(
      calculatorGateSchema.safeParse({ email: "a@b.com", consent: false }).success,
    ).toBe(false);
    expect(
      calculatorGateSchema.safeParse({ email: "invalido", consent: true }).success,
    ).toBe(false);
  });

  it("candidatura exige telefone e área", () => {
    const base = {
      name: "João Souza",
      email: "joao@exemplo.com",
      phone: "5499999000",
      consent: true as const,
    };
    expect(jobApplicationFormSchema.safeParse({ ...base, area: "Engenharia" }).success).toBe(true);
    expect(jobApplicationFormSchema.safeParse({ ...base, area: "" }).success).toBe(false);
    expect(
      jobApplicationFormSchema.safeParse({ ...base, phone: "123", area: "Engenharia" }).success,
    ).toBe(false);
  });
});

describe("LEAD_SOURCES", () => {
  it("não tem valores duplicados", () => {
    expect(new Set(LEAD_SOURCES).size).toBe(LEAD_SOURCES.length);
  });
});
