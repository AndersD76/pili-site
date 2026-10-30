import { describe, expect, it } from "vitest";
import { mascaraTelefoneBR } from "./telefone";

describe("mascaraTelefoneBR", () => {
  it("formata celular com 9 dígitos", () => {
    expect(mascaraTelefoneBR("54991412971")).toBe("(54) 99141-2971");
  });

  it("formata fixo com 8 dígitos", () => {
    expect(mascaraTelefoneBR("5435222828")).toBe("(54) 3522-2828");
  });

  it("acompanha a digitação", () => {
    expect(mascaraTelefoneBR("5")).toBe("(5");
    expect(mascaraTelefoneBR("54")).toBe("(54");
    expect(mascaraTelefoneBR("549")).toBe("(54) 9");
    expect(mascaraTelefoneBR("549914")).toBe("(54) 9914");
    expect(mascaraTelefoneBR("5499141")).toBe("(54) 9914-1");
  });

  it("reformata o que já veio com máscara ou com espaços", () => {
    expect(mascaraTelefoneBR("(54) 99141-2971")).toBe("(54) 99141-2971");
    expect(mascaraTelefoneBR("54 9 9141 2971")).toBe("(54) 99141-2971");
  });

  it("tira o DDI 55 quando o número é colado com ele", () => {
    expect(mascaraTelefoneBR("+55 54 99141-2971")).toBe("(54) 99141-2971");
    expect(mascaraTelefoneBR("5554991412971")).toBe("(54) 99141-2971");
  });

  it("não passa de 11 dígitos", () => {
    expect(mascaraTelefoneBR("549914129719999")).toBe("(54) 99141-2971");
  });

  it("apagar tudo deixa vazio", () => {
    expect(mascaraTelefoneBR("")).toBe("");
    expect(mascaraTelefoneBR("()- ")).toBe("");
  });

  // O servidor aceita de 8 a 20 caracteres: a máscara não pode empurrar um
  // número válido para fora dessa faixa.
  it("o resultado cabe na validação do servidor", () => {
    expect(mascaraTelefoneBR("54991412971").length).toBeLessThanOrEqual(20);
    expect(mascaraTelefoneBR("5435222828").length).toBeGreaterThanOrEqual(8);
  });
});
