"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { logError } from "@/lib/prisma-errors";
import { firstIssue } from "@/lib/validators/admin";

/**
 * URL opcional. Sem `.transform()` de propósito: transformar faria o tipo de
 * entrada divergir do de saída, e o react-hook-form tipa o formulário pelo tipo
 * de saída. A conversão de vazio para `null` acontece na gravação.
 */
const urlOpcional = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || /^https?:\/\//.test(v), {
    message: "Informe uma URL completa, começando com https://",
  });

export const siteSettingsSchema = z.object({
  razaoSocial: z.string().trim().min(1, "Razão social obrigatória").max(200),
  cnpj: z.string().trim().min(1, "CNPJ obrigatório").max(20),
  endereco: z.string().trim().min(1, "Endereço obrigatório").max(200),
  telefone: z.string().trim().min(1, "Telefone obrigatório").max(30),
  whatsapp: z.string().trim().min(1, "WhatsApp obrigatório").max(30),
  email: z.string().trim().email("E-mail inválido"),
  emailComercial: z.string().trim().email("E-mail comercial inválido"),
  fundacao: z.coerce
    .number()
    .int()
    .min(1900, "Ano inválido")
    .max(new Date().getFullYear(), "Ano inválido"),
  instagram: urlOpcional,
  linkedin: urlOpcional,
  facebook: urlOpcional,
  youtube: urlOpcional,
  piliTechUrl: urlOpcional,
  // Coordenadas do mapa. Vazio significa "não exibir o mapa".
  mapaLat: z
    .string()
    .trim()
    .refine((v) => v === "" || (!isNaN(Number(v)) && Math.abs(Number(v)) <= 90), {
      message: "Latitude inválida (entre -90 e 90)",
    }),
  mapaLng: z
    .string()
    .trim()
    .refine((v) => v === "" || (!isNaN(Number(v)) && Math.abs(Number(v)) <= 180), {
      message: "Longitude inválida (entre -180 e 180)",
    }),
  mapaZoom: z.coerce.number().int().min(1, "Zoom entre 1 e 19").max(19, "Zoom entre 1 e 19"),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

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
