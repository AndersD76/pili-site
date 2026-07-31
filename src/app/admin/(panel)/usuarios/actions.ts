"use server";

import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { isUniqueConstraintError, logError } from "@/lib/prisma-errors";
import { passwordSchema } from "@/lib/validators/user";
import type { Role } from "@prisma/client";

/* ---------- constantes ---------- */

const BCRYPT_ROUNDS = 12;

/* ---------- types ---------- */

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  company?: string;
  phone?: string;
  cpfCnpj?: string;
}

interface ActionResult {
  success: boolean;
  error?: string;
}

/* ---------- helpers ---------- */

/** Mesma regra usada pelo formulário — ver `lib/validators/user.ts`. */
function validatePassword(password: string): string | null {
  const parsed = passwordSchema.safeParse(password);
  return parsed.success ? null : (parsed.error.issues[0]?.message ?? "Senha inválida.");
}

/* ---------- createUser ---------- */

export async function createUser(input: CreateUserInput): Promise<ActionResult> {
  await requireAdmin();

  const { name, email, password, role, company, phone, cpfCnpj } = input;

  if (!name || !email || !password) {
    return { success: false, error: "Nome, email e senha são obrigatórios." };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { success: false, error: passwordError };
  }

  try {
    const passwordHash = await hash(password, BCRYPT_ROUNDS);

    await db.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role,
        company: company || null,
        phone: phone || null,
        cpfCnpj: cpfCnpj || null,
      },
    });

    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return { success: false, error: "Já existe um usuário com este email." };
    }
    logError("USUARIOS_CREATE", err);
    return { success: false, error: "Erro ao criar usuário." };
  }
}

/* ---------- resetPassword ---------- */

export async function resetPassword(
  userId: string,
  newPassword: string,
): Promise<ActionResult> {
  await requireAdmin();

  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    return { success: false, error: passwordError };
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return { success: false, error: "Usuário não encontrado." };
    }

    const passwordHash = await hash(newPassword, BCRYPT_ROUNDS);

    await db.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    revalidatePath("/admin/usuarios");
    revalidatePath(`/admin/usuarios/${userId}`);
    return { success: true };
  } catch (err) {
    logError("USUARIOS_RESET_PASSWORD", err);
    return { success: false, error: "Erro ao redefinir senha." };
  }
}

/* ---------- updateUser ---------- */

interface UpdateUserInput {
  name: string;
  email: string;
  role: Role;
  company?: string;
  phone?: string;
  cpfCnpj?: string;
}

export async function updateUser(
  userId: string,
  input: UpdateUserInput,
): Promise<ActionResult> {
  const session = await requireAdmin();

  const { name, email, role, company, phone, cpfCnpj } = input;

  if (!name || !email) {
    return { success: false, error: "Nome e e-mail são obrigatórios." };
  }

  // Um admin rebaixando a si mesmo se trancaria fora do painel — e não haveria
  // outro caminho para voltar, já que não existe fluxo de recuperação de senha.
  if (session.user.id === userId && role !== "ADMIN") {
    return {
      success: false,
      error: "Você não pode alterar o próprio perfil de administrador.",
    };
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: {
        name,
        email: email.toLowerCase().trim(),
        role,
        company: company || null,
        phone: phone || null,
        cpfCnpj: cpfCnpj || null,
      },
    });

    revalidatePath("/admin/usuarios");
    revalidatePath(`/admin/usuarios/${userId}`);
    return { success: true };
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return { success: false, error: "Já existe um usuário com este e-mail." };
    }
    logError("USUARIOS_UPDATE", err);
    return { success: false, error: "Erro ao atualizar usuário." };
  }
}
