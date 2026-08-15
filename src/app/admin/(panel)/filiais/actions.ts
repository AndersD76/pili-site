"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { logError } from "@/lib/prisma-errors";
import {
  firstIssue,
  filialSchema,
  type FilialInput,
} from "@/lib/validators/admin";

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
