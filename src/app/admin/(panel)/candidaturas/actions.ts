"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { logError } from "@/lib/prisma-errors";

/** Teto de segurança na listagem do painel. */
const MAX_LIST = 200;

export async function getCandidaturas() {
  await requireAdmin();

  try {
    const candidaturas = await db.jobApplication.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        area: true,
        message: true,
        cvFilename: true,
        cvSize: true,
        reviewedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: MAX_LIST,
    });
    return { data: candidaturas, error: null };
  } catch (err) {
    logError("CANDIDATURAS_LIST", err);
    return { data: [], error: "Erro ao carregar candidaturas" };
  }
}

/** Marca (ou desmarca) a candidatura como analisada. */
export async function toggleRevisada(id: string, revisada: boolean) {
  await requireAdmin();

  try {
    await db.jobApplication.update({
      where: { id },
      data: { reviewedAt: revisada ? new Date() : null },
    });
    revalidatePath("/admin/candidaturas");
    return { success: true, error: null };
  } catch (err) {
    logError("CANDIDATURA_REVISAR", err);
    return { success: false, error: "Erro ao atualizar" };
  }
}

/**
 * Exclusão em duas etapas.
 *
 * O soft delete tira a candidatura da tela e o currículo do ar (a rota confere
 * `deletedAt`), mas mantém o registro. O binário é apagado junto: guardar um
 * currículo que ninguém mais vê é exatamente o que a LGPD chama de retenção
 * sem finalidade.
 */
export async function excluirCandidatura(id: string) {
  await requireAdmin();

  try {
    await db.jobApplication.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        cvData: null,
        cvFilename: null,
        cvMimeType: null,
        cvSize: null,
      },
    });
    revalidatePath("/admin/candidaturas");
    return { success: true, error: null };
  } catch (err) {
    logError("CANDIDATURA_EXCLUIR", err);
    return { success: false, error: "Erro ao excluir" };
  }
}
