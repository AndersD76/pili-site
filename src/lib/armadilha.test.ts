import { describe, expect, it } from "vitest";
import { caiuNaArmadilha } from "./armadilha";

describe("caiuNaArmadilha", () => {
  it("descarta quando o campo invisível veio preenchido", () => {
    expect(caiuNaArmadilha("gFEjBkaOrvRciHVxGnqxI")).toBe(true);
    expect(caiuNaArmadilha("http://spam.example")).toBe(true);
  });

  // Um falso positivo aqui descarta um lead de verdade em silêncio — o
  // visitante vê "enviado" e ninguém nunca recebe o contato.
  it("deixa passar o envio normal", () => {
    expect(caiuNaArmadilha("")).toBe(false);
    expect(caiuNaArmadilha("   ")).toBe(false);
    // Campo ausente: `FormData.get` devolve null, o JSON não traz a chave.
    expect(caiuNaArmadilha(null)).toBe(false);
    expect(caiuNaArmadilha(undefined)).toBe(false);
  });

  it("ignora o que não for texto", () => {
    expect(caiuNaArmadilha(0)).toBe(false);
    expect(caiuNaArmadilha({})).toBe(false);
  });
});
