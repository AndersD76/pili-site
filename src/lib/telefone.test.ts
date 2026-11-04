import { describe, expect, it } from "vitest";
import {
  mascaraTelefoneBR,
  telefoneBRValido,
  telefoneEstrangeiro,
} from "./telefone";

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

describe("telefoneBRValido", () => {
  it("aceita celular e fixo reais", () => {
    expect(telefoneBRValido("(54) 99141-2971")).toBe(true);
    expect(telefoneBRValido("(54) 3522-2828")).toBe(true);
    expect(telefoneBRValido("+55 54 99141-2971")).toBe(true);
  });

  // O lead do Roblox: DDD 23 não existe, e "19850..." não é celular.
  it("recusa o telefone do lead de 04/11", () => {
    expect(telefoneBRValido("(23) 19850-7853")).toBe(false);
  });

  it("recusa DDD inexistente", () => {
    expect(telefoneBRValido("(20) 99999-9999")).toBe(false);
    expect(telefoneBRValido("(90) 99999-9999")).toBe(false);
  });

  it("recusa celular que nao comeca com 9 e fixo que comeca com 6 a 9", () => {
    expect(telefoneBRValido("(54) 19141-2971")).toBe(false);
    expect(telefoneBRValido("(54) 9522-2828")).toBe(false);
  });

  it("recusa tamanho errado", () => {
    expect(telefoneBRValido("(54) 9914-129")).toBe(false);
    expect(telefoneBRValido("")).toBe(false);
  });
});

describe("telefoneEstrangeiro", () => {
  it("reconhece numero com DDI de outro pais", () => {
    expect(telefoneEstrangeiro("+59175016944")).toBe(true);
    expect(telefoneEstrangeiro("+595 981 123456")).toBe(true);
  });

  it("numero brasileiro nao e estrangeiro", () => {
    expect(telefoneEstrangeiro("+55 54 99141-2971")).toBe(false);
    expect(telefoneEstrangeiro("(54) 99141-2971")).toBe(false);
  });
});
