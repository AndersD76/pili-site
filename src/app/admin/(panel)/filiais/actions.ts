"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { logError } from "@/lib/prisma-errors";
import { firstIssue } from "@/lib/validators/admin";

/**
 * Coordenada opcional, recebida como texto.
 *
 * Sem `.transform()`, pelo mesmo motivo de `config/actions.ts`: transformar
 * faria o tipo de entrada divergir do de saída, e o react-hook-form tipa o
 * formulário pelo tipo de saída. A conversão para número acontece na gravação.
 */
function coordenada(limite: number, nome: string) {
  return z
    .string()
    .trim()
    .refine((v) => v === "" || (!isNaN(Number(v)) && Math.abs(Number(v)) <= limite), {
      message: `${nome} inválida (entre -${limite} e ${limite})`,
    });
}

export const filialSchema = z
  .object({
    nome: z.string().trim().min(1, "Nome obrigatório").max(120),
    tipo: z.enum(["FILIAL", "ESCRITORIO", "ASSISTENCIA"]),
    cidade: z.string().trim().min(1, "Cidade obrigatória").max(120),
    uf: z
      .string()
      .trim()
      .length(2, "UF deve ter 2 letras")
      .regex(/^[A-Za-z]{2}$/, "UF deve conter apenas letras"),
    endereco: z.string().trim().min(1, "Endereço obrigatório").max(240),
    cep: z
      .string()
      .trim()
      .refine((v) => v === "" || /^\d{5}-?\d{3}$/.test(v), {
        message: "CEP inválido (use 00000-000)",
      }),
    telefone: z.string().trim().max(30),
    lat: coordenada(90, "Latitude"),
    lng: coordenada(180, "Longitude"),
    ordem: z.coerce.number().int().min(0).max(999),
    ativa: z.boolean(),
  })
  // Meia coordenada não plota: ou as duas, ou nenhuma.
  .refine((d) => (d.lat === "") === (d.lng === ""), {
    message: "Preencha latitude e longitude juntas, ou deixe as duas em branco",
    path: ["lng"],
  });

export type FilialInput = z.infer<typeof filialSchema>;

interface ActionResult {
  success: boolean;
  error?: string;
}

/** Campo vazio no formulário significa "não informado" no banco. */
function vazioParaNulo(value: string): string | null {
  return value.trim() === "" ? null : value.trim();
}

function paraRegistro(d: FilialInput) {
  return {
    nome: d.nome,
    tipo: d.tipo,
    cidade: d.cidade,
    uf: d.uf.toUpperCase(),
    endereco: d.endereco,
    cep: vazioParaNulo(d.cep),
    telefone: vazioParaNulo(d.telefone),
    lat: d.lat === "" ? null : Number(d.lat),
    lng: d.lng === "" ? null : Number(d.lng),
    ordem: d.ordem,
    ativa: d.ativa,
  };
}

/** O rodapé usa estes dados em todas as páginas públicas. */
function revalidarTudo() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/filiais");
}

export async function criarFilial(input: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = filialSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  try {
    await db.filial.create({ data: paraRegistro(parsed.data) });
    revalidarTudo();
    return { success: true };
  } catch (err) {
    logError("FILIAL_CREATE", err);
    return { success: false, error: "Erro ao criar a unidade." };
  }
}

export async function atualizarFilial(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = filialSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  try {
    await db.filial.update({ where: { id }, data: paraRegistro(parsed.data) });
    revalidarTudo();
    return { success: true };
  } catch (err) {
    logError("FILIAL_UPDATE", err);
    return { success: false, error: "Erro ao salvar a unidade." };
  }
}

export async function excluirFilial(id: string): Promise<ActionResult> {
  await requireAdmin();

  try {
    await db.filial.delete({ where: { id } });
    revalidarTudo();
    return { success: true };
  } catch (err) {
    logError("FILIAL_DELETE", err);
    return { success: false, error: "Erro ao excluir a unidade." };
  }
}
