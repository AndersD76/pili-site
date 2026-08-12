import { db } from "./db";
import { logError } from "./prisma-errors";

/**
 * Entrega dos chamados de manutenção ao Portal Pili.
 *
 * O site registra o chamado; a ordem de serviço é aberta no Portal. Esta é a
 * ponte entre os dois — e é o caminho oficial de entrega, não o e-mail.
 *
 * O envio ficava embutido na server action como `fetch(...).catch(...)`, sem
 * `await`: uma indisponibilidade do Portal descartava o chamado com uma linha
 * de log e nada mais. Aqui o resultado é aguardado, gravado em `notifiedAt` e,
 * quando falha, fica pendente para reenvio.
 */

/** Não deixa o Portal fora do ar segurar o formulário do cliente. */
const TIMEOUT_MS = 8_000;

export interface TicketPortal {
  id: string;
  type: string;
  urgency: string;
  description: string;
  contactName: string;
  contactPhone: string;
  clientName: string;
  clientEmail: string | null;
  clientCompany: string | null;
  equipmentName: string;
  serialNumber: string;
  installedAddress: string | null;
}

/** Configuração presente e completa? */
export function portalConfigurado(): boolean {
  return Boolean(
    process.env.PORTAL_PILI_WEBHOOK_URL &&
      process.env.PORTAL_PILI_WEBHOOK_SECRET,
  );
}

function corpo(t: TicketPortal) {
  return {
    tipo: t.type,
    prioridade: t.urgency,
    cliente_nome: t.clientCompany || t.clientName || "—",
    cliente_telefone: t.contactPhone,
    cliente_email: t.clientEmail,
    cliente_endereco: t.installedAddress,
    equipamento_tipo: t.equipmentName,
    equipamento_numero_serie: t.serialNumber,
    descricao: t.description,
    contato_nome: t.contactName,
    contato_telefone: t.contactPhone,
    origem: "SITE_CLIENTE",
  };
}

/**
 * Envia um chamado ao Portal e marca `notifiedAt` quando ele aceita.
 *
 * Nunca lança: o chamado já está gravado quando isto roda, e uma falha de
 * entrega não pode virar erro para o cliente que acabou de abrir o pedido.
 *
 * @returns `true` quando o Portal confirmou o recebimento.
 */
export async function enviarTicketPortal(t: TicketPortal): Promise<boolean> {
  const url = process.env.PORTAL_PILI_WEBHOOK_URL;
  const secret = process.env.PORTAL_PILI_WEBHOOK_SECRET;

  if (!url || !secret) {
    // Estado esperado enquanto o endereço do Portal não estiver definido. O
    // chamado fica com `notifiedAt` nulo e aparece como pendente no painel.
    return false;
  }

  try {
    const resposta = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": secret,
      },
      body: JSON.stringify(corpo(t)),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!resposta.ok) {
      // O corpo costuma trazer o motivo (segredo errado, campo faltando); sem
      // ele o diagnóstico vira adivinhação.
      const detalhe = await resposta.text().catch(() => "");
      logError(
        "PORTAL_WEBHOOK",
        new Error(
          `Portal recusou o chamado: HTTP ${resposta.status}. ${detalhe.slice(0, 300)}`,
        ),
      );
      return false;
    }

    await db.maintenanceRequest.update({
      where: { id: t.id },
      data: { notifiedAt: new Date() },
    });

    return true;
  } catch (err) {
    logError("PORTAL_WEBHOOK", err);
    return false;
  }
}

/**
 * Reenvia os chamados que nunca chegaram ao Portal.
 *
 * Cobre os dois casos previsíveis: o Portal esteve fora do ar, ou a integração
 * só foi configurada depois que os primeiros chamados já tinham sido abertos.
 */
export async function reenviarTicketsPendentes(): Promise<{
  enviados: number;
  falharam: number;
}> {
  const pendentes = await db.maintenanceRequest.findMany({
    where: { notifiedAt: null, status: { in: ["ABERTA", "EM_ANDAMENTO"] } },
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
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  let enviados = 0;

  for (const c of pendentes) {
    const ok = await enviarTicketPortal({
      id: c.id,
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
    });
    if (ok) enviados++;
  }

  return { enviados, falharam: pendentes.length - enviados };
}
