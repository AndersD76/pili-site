import { getResend, FROM_EMAIL } from "./client";
import { MaintenanceTicketEmail } from "./templates/maintenance-ticket";
import { logError } from "@/lib/prisma-errors";
import { db } from "@/lib/db";

/**
 * Destino dos chamados de manutenção.
 *
 * Fixo por decisão do cliente, com escape por variável de ambiente para não
 * exigir deploy se o endereço mudar.
 */
export const MAINTENANCE_NOTIFY_EMAIL =
  process.env.MAINTENANCE_NOTIFY_EMAIL ?? "comercial1@pili.ind.br";

export interface MaintenanceTicketInput {
  id: string;
  number: number;
  type: string;
  urgency: string;
  description: string;
  contactName: string;
  contactPhone: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string | null;
  equipmentName: string;
  serialNumber: string;
  installedAddress: string | null;
  createdAt: Date;
}

/**
 * Envia o ticket de manutenção para o comercial.
 *
 * **Hoje esta função não envia nada**: nenhum transporte de e-mail está
 * configurado (`RESEND_API_KEY` ausente, por decisão do cliente). Ela existe
 * agora para que o chamado já registre a intenção de notificar — `notifiedAt`
 * fica nulo — e para concentrar num único ponto a troca futura de transporte.
 *
 * Quando o transporte for definido, só este arquivo muda; o chamador não sabe
 * qual serviço está por trás.
 *
 * Nunca lança: a solicitação já está gravada quando isto roda, e uma falha de
 * envio não pode virar erro para o cliente que abriu o chamado.
 *
 * @returns `true` quando o e-mail saiu de fato.
 */
export async function sendMaintenanceEmail(
  ticket: MaintenanceTicketInput,
): Promise<boolean> {
  const resend = getResend();

  if (!resend) {
    // Não é erro: é o estado esperado enquanto o transporte não for escolhido.
    // O chamado continua visível em /admin/manutencao e `notifiedAt` nulo
    // marca que o aviso ainda não saiu.
    logError(
      "MANUTENCAO_EMAIL_PENDENTE",
      new Error(
        `Chamado #${ticket.number} gravado sem notificação: nenhum transporte de e-mail configurado.`,
      ),
    );
    return false;
  }

  try {
    const urgente = ticket.urgency === "PARADA" || ticket.urgency === "ALTA";

    await resend.emails.send({
      from: FROM_EMAIL,
      to: MAINTENANCE_NOTIFY_EMAIL,
      // O cliente responde direto ao e-mail e a conversa já sai encaminhada.
      replyTo: ticket.clientEmail,
      subject: `${urgente ? "[URGENTE] " : ""}Chamado #${ticket.number} — ${ticket.equipmentName} (${ticket.serialNumber})`,
      react: <MaintenanceTicketEmail {...ticket} />,
    });

    await db.maintenanceRequest.update({
      where: { id: ticket.id },
      data: { notifiedAt: new Date() },
    });

    return true;
  } catch (err) {
    logError("MANUTENCAO_EMAIL_FALHOU", err);
    return false;
  }
}

/**
 * Reenvia os chamados que nunca foram notificados.
 *
 * Serve para o dia em que o transporte de e-mail for configurado: nenhum
 * chamado aberto nesse meio-tempo se perde.
 */
export async function notificarChamadosPendentes(): Promise<number> {
  const pendentes = await db.maintenanceRequest.findMany({
    where: { notifiedAt: null, status: { in: ["ABERTA", "EM_ANDAMENTO"] } },
    include: {
      equipment: true,
      user: { select: { name: true, email: true, company: true } },
    },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  let enviados = 0;

  for (const c of pendentes) {
    const ok = await sendMaintenanceEmail({
      id: c.id,
      number: c.number,
      type: c.type,
      urgency: c.urgency,
      description: c.description,
      contactName: c.contactName,
      contactPhone: c.contactPhone,
      clientName: c.user.name ?? "—",
      clientEmail: c.user.email,
      clientCompany: c.user.company,
      equipmentName: c.equipment.productName,
      serialNumber: c.equipment.serialNumber,
      installedAddress: c.equipment.installedAddress,
      createdAt: c.createdAt,
    });
    if (ok) enviados++;
  }

  return enviados;
}
