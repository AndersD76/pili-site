"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireRoleOrThrow } from "@/lib/auth-guard";
import { logError } from "@/lib/prisma-errors";
import {
  reenviarTicketsPendentes,
  portalConfigurado,
} from "@/lib/portal-pili";

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

/**
 * Reenvia ao Portal os chamados que nunca chegaram lá.
 *
 * Existe porque a integração pode ser ligada depois dos primeiros chamados, ou
 * o Portal pode ter estado fora do ar — nos dois casos o pedido do cliente não
 * pode ficar só neste painel.
 */
export async function reenviarPendentes() {
  await requireRoleOrThrow(...PAPEIS);

  if (!portalConfigurado()) {
    return {
      success: false,
      error:
        "Integração com o Portal Pili não configurada (falta PORTAL_PILI_WEBHOOK_URL ou o segredo).",
    };
  }

  try {
    const { enviados, falharam } = await reenviarTicketsPendentes();
    revalidatePath("/admin/manutencao");
    return { success: true, enviados, falharam, error: null };
  } catch (err) {
    logError("MANUTENCAO_REENVIAR", err);
    return { success: false, error: "Erro ao reenviar os chamados" };
  }
}
