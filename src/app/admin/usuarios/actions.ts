"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";

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

/* ---------- createUser ---------- */

export async function createUser(input: CreateUserInput): Promise<ActionResult> {
  const { name, email, password, role, company, phone, cpfCnpj } = input;

  if (!name || !email || !password) {
    return { success: false, error: "Nome, email e senha sao obrigatorios." };
  }

  if (password.length < 6) {
    return { success: false, error: "A senha deve ter no minimo 6 caracteres." };
  }

  try {
    const passwordHash = bcrypt.hashSync(password, 10);

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
    if (
      err instanceof Error &&
      err.message.includes("Unique")
    ) {
      return { success: false, error: "Ja existe um usuario com este email." };
    }
    return { success: false, error: "Erro ao criar usuario." };
  }
}

/* ---------- resetPassword ---------- */

export async function resetPassword(
  userId: string,
  newPassword: string
): Promise<ActionResult> {
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: "A senha deve ter no minimo 6 caracteres." };
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user) {
      return { success: false, error: "Usuario nao encontrado." };
    }

    const passwordHash = bcrypt.hashSync(newPassword, 10);

    await db.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao redefinir senha." };
  }
}
