"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireRoleOrThrow } from "@/lib/auth-guard";
import { logError } from "@/lib/prisma-errors";

/** Teto de segurança na listagem do painel. */
const MAX_LIST = 200;

const PAPEIS = ["ADMIN", "COMERCIAL"] as const;

export async function getChamados() {
  await requireRoleOrThrow(...PAPEIS);

  try {
    const chamados = await db.maintenanceRequest.findMany({
      include: {
        equipment: {
          select: {
            productName: true,
            serialNumber: true,
            installedAddress: true,
          },
        },
        user: { select: { name: true, email: true, company: true } },
      },
      // Chamados abertos primeiro; dentro deles, os mais antigos no topo — o
      // que espera há mais tempo é o que precisa de resposta.
      orderBy: [{ status: "asc" }, { createdAt: "asc" }],
      take: MAX_LIST,
    });
    return { data: chamados, error: null };
  } catch (err) {
    logError("MANUTENCAO_LIST", err);
    return { data: [], error: "Erro ao carregar chamados" };
  }
}

const atualizacaoSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["ABERTA", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"]),
  internalNote: z.string().trim().max(4000),
});

export async function atualizarChamado(input: unknown) {
  await requireRoleOrThrow(...PAPEIS);

  const parsed = atualizacaoSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos" };
  }

  const { id, status, internalNote } = parsed.data;

  try {
    await db.maintenanceRequest.update({
      where: { id },
      data: { status, internalNote: internalNote || null },
    });

    revalidatePath("/admin/manutencao");
    revalidatePath("/portal");
    return { success: true, error: null };
  } catch (err) {
    logError("MANUTENCAO_ATUALIZAR", err);
    return { success: false, error: "Erro ao atualizar o chamado" };
  }
}
