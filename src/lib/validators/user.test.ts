import { describe, it, expect } from "vitest";
import {
  passwordSchema,
  cpfCnpjSchema,
  phoneSchema,
  isValidCpf,
  isValidCnpj,
  MIN_PASSWORD_LENGTH,
} from "./user";

describe("passwordSchema", () => {
  it("rejeita senha abaixo do mínimo", () => {
    expect(passwordSchema.safeParse("Ab1x").success).toBe(false);
  });

  it("rejeita senha longa de uma única classe de caracteres", () => {
    expect(passwordSchema.safeParse("aaaaaaaaaaaa").success).toBe(false);
  });

  it("aceita senha com tamanho e duas classes", () => {
    expect(passwordSchema.safeParse("senhaSegura1").success).toBe(true);
  });

  it("o mínimo é o mesmo usado pelo formulário e pela action", () => {
    expect(MIN_PASSWORD_LENGTH).toBe(10);
    // um caractere abaixo do mínimo (9 no total) reprova
    expect(passwordSchema.safeParse("a".repeat(8) + "1").success).toBe(false);
    // exatamente no mínimo (10 no total) aprova
    expect(passwordSchema.safeParse("a".repeat(9) + "1").success).toBe(true);
  });
});

describe("isValidCpf", () => {
  it("valida CPF correto com e sem máscara", () => {
    expect(isValidCpf("529.982.247-25")).toBe(true);
    expect(isValidCpf("52998224725")).toBe(true);
  });

  it("rejeita dígito verificador errado", () => {
    expect(isValidCpf("529.982.247-24")).toBe(false);
  });

  it("rejeita sequência repetida e tamanho inválido", () => {
    expect(isValidCpf("111.111.111-11")).toBe(false);
    expect(isValidCpf("123")).toBe(false);
  });
});

describe("isValidCnpj", () => {
  it("valida CNPJ correto com e sem máscara", () => {
    expect(isValidCnpj("11.222.333/0001-81")).toBe(true);
    expect(isValidCnpj("11222333000181")).toBe(true);
  });

  it("rejeita dígito verificador errado", () => {
    expect(isValidCnpj("11.222.333/0001-82")).toBe(false);
  });

  it("rejeita sequência repetida", () => {
    expect(isValidCnpj("11.111.111/1111-11")).toBe(false);
  });
});

describe("cpfCnpjSchema", () => {
  it("aceita vazio (campo opcional)", () => {
    expect(cpfCnpjSchema.safeParse(undefined).success).toBe(true);
  });

  it("normaliza para dígitos", () => {
    expect(cpfCnpjSchema.parse("529.982.247-25")).toBe("52998224725");
  });

  it("rejeita documento inválido", () => {
    expect(cpfCnpjSchema.safeParse("123").success).toBe(false);
    expect(cpfCnpjSchema.safeParse("abc").success).toBe(false);
  });
});

describe("phoneSchema", () => {
  it("aceita telefone com DDD, com ou sem máscara", () => {
    expect(phoneSchema.safeParse("(54) 99141-2971").success).toBe(true);
    expect(phoneSchema.safeParse("5499141297").success).toBe(true);
  });

  it("rejeita telefone sem DDD", () => {
    expect(phoneSchema.safeParse("99999").success).toBe(false);
  });
});
