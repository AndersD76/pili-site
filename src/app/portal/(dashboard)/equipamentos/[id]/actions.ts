"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requirePortalAuth } from "@/lib/auth-guard";
import { logError } from "@/lib/prisma-errors";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { sendMaintenanceEmail } from "@/lib/email/send-maintenance-email";
import { enviarTicketPortal } from "@/lib/portal-pili";

export const solicitacaoSchema = z.object({
  equipmentId: z.string().min(1),
  type: z.enum([
    "CORRETIVA",
    "PREVENTIVA",
    "INSTALACAO",
    "DUVIDA_TECNICA",
    "OUTRO",
  ]),
  urgency: z.enum(["BAIXA", "MEDIA", "ALTA", "PARADA"]),
  description: z
    .string()
    .trim()
    .min(20, "Descreva o problema com pelo menos 20 caracteres")
    .max(4000),
  contactName: z.string().trim().min(1, "Informe quem atende no local").max(200),
  contactPhone: z.string().trim().min(8, "Telefone inválido").max(30),
});

export type SolicitacaoInput = z.infer<typeof solicitacaoSchema>;

/**
 * Abre um chamado de manutenção para um equipamento do cliente.
 *
 * O equipamento é conferido contra o dono na mesma consulta: um `equipmentId`
 * de outro cliente não abre chamado nenhum. Server Actions são endpoints POST
 * públicos — validar aqui não é redundância do formulário.
 */
export async function abrirSolicitacao(
  input: unknown,
): Promise<{ success: boolean; number?: number; error?: string }> {
  const session = await requirePortalAuth();

  // Um chamado é barato de abrir e caro de triar; o limite evita que um clique
  // repetido vire dez tickets iguais na caixa do comercial.
  const ip = getClientIp(new Request("http://local", { headers: await headers() }));
  const rate = await consumeRateLimit({
    key: `manutencao:${session.user.id}:${ip ?? "sem-ip"}`,
    limit: 5,
    windowSeconds: 60 * 10,
  });

  if (!rate.success) {
    return {
      success: false,
      error: "Muitas solicitações seguidas. Tente novamente em alguns minutos.",
    };
  }

  const parsed = solicitacaoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const d = parsed.data;

  try {
    const equipamento = await db.clientEquipment.findFirst({
      where: { id: d.equipmentId, userId: session.user.id },
      select: {
        id: true,
        productName: true,
        serialNumber: true,
        installedAddress: true,
      },
    });

    if (!equipamento) {
      return { success: false, error: "Equipamento não encontrado." };
    }

    const chamado = await db.maintenanceRequest.create({
      data: {
        equipmentId: equipamento.id,
        userId: session.user.id,
        type: d.type,
        urgency: d.urgency,
        description: d.description,
        contactName: d.contactName,
        contactPhone: d.contactPhone,
      },
      select: { id: true, number: true, createdAt: true },
    });

    const usuario = await db.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, company: true },
    });

    // Cópia por e-mail, secundária: quem manda no `notifiedAt` é o Portal.
    // Hoje não há transporte configurado e a função só registra a ausência.
    await sendMaintenanceEmail({
      id: chamado.id,
      number: chamado.number,
      type: d.type,
      urgency: d.urgency,
      description: d.description,
      contactName: d.contactName,
      contactPhone: d.contactPhone,
      clientName: usuario?.name ?? "—",
      clientEmail: usuario?.email ?? "—",
      clientCompany: usuario?.company ?? null,
      equipmentName: equipamento.productName,
      serialNumber: equipamento.serialNumber,
      installedAddress: equipamento.installedAddress,
      createdAt: chamado.createdAt,
    });

    // Entrega oficial do chamado. Aguardada de propósito: sem `await` uma
    // recusa do Portal sumia sem deixar rastro recuperável.
    await enviarTicketPortal({
      id: chamado.id,
      type: d.type,
      urgency: d.urgency,
      description: d.description,
      contactName: d.contactName,
      contactPhone: d.contactPhone,
      clientName: usuario?.name ?? "—",
      clientEmail: usuario?.email ?? null,
      clientCompany: usuario?.company ?? null,
      equipmentName: equipamento.productName,
      serialNumber: equipamento.serialNumber,
      installedAddress: equipamento.installedAddress,
    });

    revalidatePath(`/portal/equipamentos/${equipamento.id}`);
    revalidatePath("/portal");
    revalidatePath("/admin/manutencao");

    return { success: true, number: chamado.number };
  } catch (err) {
    logError("MANUTENCAO_ABRIR", err);
    return { success: false, error: "Erro ao abrir o chamado." };
  }
}
