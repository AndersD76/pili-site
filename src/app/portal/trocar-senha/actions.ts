"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requirePortalAuth } from "@/lib/auth-guard";
import { logError } from "@/lib/prisma-errors";
import { trocaSenhaSchema } from "@/lib/validators/portal";

/**
 * Troca a senha do próprio usuário.
 *
 * Exige a senha atual mesmo com sessão válida: sem isso, uma sessão esquecida
 * num computador compartilhado permitiria trocar a senha e tomar a conta.
 */
export async function trocarSenha(
  input: unknown,
): Promise<{ success: boolean; error?: string }> {
  const session = await requirePortalAuth();

  const parsed = trocaSenhaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    });

    if (!user?.passwordHash) {
      return { success: false, error: "Conta sem senha cadastrada." };
    }

    const { compare, hash } = await import("bcryptjs");

    if (!(await compare(parsed.data.atual, user.passwordHash))) {
      return { success: false, error: "Senha atual incorreta." };
    }

    await db.user.update({
      where: { id: session.user.id },
      data: {
        passwordHash: await hash(parsed.data.nova, 12),
        mustChangePassword: false,
      },
    });

    revalidatePath("/portal", "layout");
    return { success: true };
  } catch (err) {
    logError("TROCA_SENHA", err);
    return { success: false, error: "Erro ao trocar a senha." };
  }
}
