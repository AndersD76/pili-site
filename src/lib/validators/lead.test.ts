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
      phone: "54999990000",
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
      phone: "54999990000",
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

/**
 * Regras de 04/11/2026, depois de um lead de criança pedindo Robux: telefone
 * com DDD inexistente e um telefone no campo de empresa. Os casos que NÃO
 * podem ser recusados importam tanto quanto os que devem: cada falso positivo
 * é um cliente que viu "erro" e desistiu.
 */
describe("leadRequestSchema — telefone, empresa e documento", () => {
  const completo = { ...leadBase, source: "FORMULARIO" as const };

  it("recusa o lead do Robux", () => {
    const r = leadRequestSchema.safeParse({
      ...completo,
      phone: "(23) 19850-7853",
      company: "34998963866",
      pageUrl: "https://www.pili.ind.br/pt-BR/orcamento",
    });
    expect(r.success).toBe(false);
    const campos = r.success ? [] : r.error.issues.map((i) => i.path[0]);
    expect(campos).toContain("phone");
    expect(campos).toContain("company");
  });

  it("aceita telefone brasileiro real, com e sem mascara", () => {
    for (const phone of ["(54) 99141-2971", "(54) 3522-2828", "+55 54 99141-2971"]) {
      expect(leadRequestSchema.safeParse({ ...completo, phone }).success).toBe(true);
    }
  });

  it("aceita telefone de outro pais com DDI", () => {
    const r = leadRequestSchema.safeParse({ ...completo, phone: "+59175016944" });
    expect(r.success).toBe(true);
  });

  // O formulario manda pais "BR" ate no site em espanhol; o numero de la nao
  // pode ser cobrado no formato brasileiro.
  it("aceita qualquer formato vindo do site em espanhol", () => {
    const r = leadRequestSchema.safeParse({
      ...completo,
      phone: "0981 123 456",
      pageUrl: "https://www.pili.ind.br/es/orcamento",
    });
    expect(r.success).toBe(true);
  });

  it("aceita CPF e CNPJ validos, e documento em branco", () => {
    for (const cnpj of ["05.620.512/0001-74", "529.982.247-25", "", undefined]) {
      expect(leadRequestSchema.safeParse({ ...completo, cnpj }).success).toBe(true);
    }
  });

  it("recusa documento que nao fecha como CPF nem CNPJ", () => {
    const r = leadRequestSchema.safeParse({ ...completo, cnpj: "34998963866" });
    expect(r.success).toBe(false);
  });

  it("empresa com nome em espanhol passa", () => {
    const r = leadRequestSchema.safeParse({ ...completo, company: "Agrícola San José S.A." });
    expect(r.success).toBe(true);
  });
});

