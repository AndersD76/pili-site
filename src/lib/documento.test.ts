import { describe, expect, it } from "vitest";
import {
  cnpjValido,
  cpfValido,
  mascaraDocumento,
  tipoDocumento,
} from "./documento";

describe("cnpjValido", () => {
  it("aceita o CNPJ da PILI, com e sem máscara", () => {
    expect(cnpjValido("05620512000174")).toBe(true);
    expect(cnpjValido("05.620.512/0001-74")).toBe(true);
  });

  it("recusa dígito verificador errado", () => {
    expect(cnpjValido("05620512000175")).toBe(false);
    expect(cnpjValido("12345678000100")).toBe(false);
  });

  it("recusa sequência repetida e tamanho errado", () => {
    expect(cnpjValido("11111111111111")).toBe(false);
    expect(cnpjValido("0562051200017")).toBe(false);
  });
});

describe("cpfValido", () => {
  it("aceita CPF com dígito correto", () => {
    expect(cpfValido("52998224725")).toBe(true);
    expect(cpfValido("529.982.247-25")).toBe(true);
  });

  it("recusa dígito errado e sequência repetida", () => {
    expect(cpfValido("52998224726")).toBe(false);
    expect(cpfValido("11111111111")).toBe(false);
  });
});

describe("tipoDocumento", () => {
  it("identifica CPF e CNPJ pelo tamanho e pelo dígito", () => {
    expect(tipoDocumento("529.982.247-25")).toBe("cpf");
    expect(tipoDocumento("05.620.512/0001-74")).toBe("cnpj");
  });

  // O lead do Roblox trouxe um telefone no campo de empresa: um número de 11
  // dígitos que não fecha como CPF não pode passar como documento.
  it("devolve null para número que não fecha", () => {
    expect(tipoDocumento("34998963866")).toBe(null);
    expect(tipoDocumento("123")).toBe(null);
  });
});

describe("mascaraDocumento", () => {
  it("formata CPF enquanto digita", () => {
    expect(mascaraDocumento("529")).toBe("529");
    expect(mascaraDocumento("5299")).toBe("529.9");
    expect(mascaraDocumento("5299822")).toBe("529.982.2");
    expect(mascaraDocumento("52998224725")).toBe("529.982.247-25");
  });

  it("vira máscara de CNPJ a partir do 12º dígito", () => {
    expect(mascaraDocumento("05620512000174")).toBe("05.620.512/0001-74");
  });

  it("não passa de 14 dígitos", () => {
    expect(mascaraDocumento("0562051200017499")).toBe("05.620.512/0001-74");
  });
});
