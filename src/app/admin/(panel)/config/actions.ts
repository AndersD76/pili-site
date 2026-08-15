"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { logError } from "@/lib/prisma-errors";
import {
  firstIssue,
  siteSettingsSchema,
} from "@/lib/validators/admin";

/** Campo vazio no formulário significa "não informado" no banco. */
function vazioParaNulo(value: string): string | null {
  return value.trim() === "" ? null : value.trim();
}

export async function updateSiteSettings(
  input: unknown,
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const parsed = siteSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const d = parsed.data;
  const dados = {
    razaoSocial: d.razaoSocial,
    cnpj: d.cnpj,
    endereco: d.endereco,
    telefone: d.telefone,
    whatsapp: d.whatsapp,
    email: d.email,
    emailComercial: d.emailComercial,
    fundacao: d.fundacao,
    instagram: vazioParaNulo(d.instagram),
    linkedin: vazioParaNulo(d.linkedin),
    facebook: vazioParaNulo(d.facebook),
    youtube: vazioParaNulo(d.youtube),
    piliTechUrl: vazioParaNulo(d.piliTechUrl),
    mapaLat: d.mapaLat === "" ? null : Number(d.mapaLat),
    mapaLng: d.mapaLng === "" ? null : Number(d.mapaLng),
    mapaZoom: d.mapaZoom,
    statsEquipamentos: d.statsEquipamentos,
    statsPaises: d.statsPaises,
    statsCapacidade: d.statsCapacidade,
  };

  try {
    await db.siteSettings.upsert({
      where: { id: "default" },
      update: dados,
      create: { id: "default", ...dados },
    });

    // Os dados aparecem no rodapé de todas as páginas públicas.
    revalidatePath("/", "layout");
    revalidatePath("/admin/config");

    return { success: true };
  } catch (err) {
    logError("SITE_SETTINGS_UPDATE", err);
    return { success: false, error: "Erro ao salvar as configurações." };
  }
}
