import { z } from "zod";

/**
 * Política de senha compartilhada entre o formulário e a Server Action.
 *
 * Antes o cliente exigia 6 caracteres e o servidor 10 + duas classes: o usuário
 * digitava uma senha válida para o formulário e só descobria a regra real
 * depois do round-trip.
 */
export const MIN_PASSWORD_LENGTH = 10;

export const PASSWORD_HELP =
  `Mínimo de ${MIN_PASSWORD_LENGTH} caracteres, combinando ao menos duas ` +
  `categorias entre minúsculas, maiúsculas, números e símbolos.`;

/** Conta quantas classes de caracteres a senha usa. */
export function countCharacterClasses(password: string): number {
  return [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter((re) =>
    re.test(password),
  ).length;
}

export const passwordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`)
  .max(200, "Senha muito longa")
  .refine((value) => countCharacterClasses(value) >= 2, {
    message:
      "Combine ao menos duas categorias entre minúsculas, maiúsculas, números e símbolos",
  });

export const ROLES = ["CLIENTE", "TECNICO", "COMERCIAL", "ADMIN"] as const;

/** Dígitos apenas — o banco guarda CPF/CNPJ normalizado. */
function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Valida os dígitos verificadores de um CPF. */
export function isValidCpf(raw: string): boolean {
  const cpf = onlyDigits(raw);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const check = (size: number) => {
    let sum = 0;
    for (let i = 0; i < size; i++) {
      sum += Number(cpf[i]) * (size + 1 - i);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  return check(9) === Number(cpf[9]) && check(10) === Number(cpf[10]);
}

/** Valida os dígitos verificadores de um CNPJ. */
export function isValidCnpj(raw: string): boolean {
  const cnpj = onlyDigits(raw);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

  const check = (size: number) => {
    const weights =
      size === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < size; i++) {
      sum += Number(cnpj[i]) * weights[i]!;
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  return check(12) === Number(cnpj[12]) && check(13) === Number(cnpj[13]);
}

/** Aceita CPF ou CNPJ, com ou sem máscara. Vazio é válido (campo opcional). */
export const cpfCnpjSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => {
      if (!value) return true;
      const digits = onlyDigits(value);
      if (digits.length === 11) return isValidCpf(digits);
      if (digits.length === 14) return isValidCnpj(digits);
      return false;
    },
    { message: "CPF ou CNPJ inválido" },
  )
  .transform((value) => (value ? onlyDigits(value) : undefined));

/** Telefone brasileiro com DDD, com ou sem máscara. */
export const phoneSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => {
      if (!value) return true;
      const digits = onlyDigits(value);
      return digits.length >= 10 && digits.length <= 13;
    },
    { message: "Telefone inválido (informe DDD)" },
  );
