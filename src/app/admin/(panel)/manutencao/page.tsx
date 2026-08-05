import { Inbox, MailWarning } from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { formatDateTime } from "@/lib/datetime";
import { getChamados } from "./actions";
import { MAINTENANCE_NOTIFY_EMAIL } from "@/lib/email/send-maintenance-email";
import { ChamadoCard } from "@/components/admin/chamado-card";

export default async function ManutencaoPage() {
  await requireRole("ADMIN", "COMERCIAL");

  const { data: chamados, error } = await getChamados();

  const abertos = chamados.filter(
    (c) => c.status === "ABERTA" || c.status === "EM_ANDAMENTO",
  ).length;
  const semAviso = chamados.filter((c) => !c.notifiedAt && c.status !== "CANCELADA").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-pili-black">
          Manutenção
        </h1>
        <p className="mt-1 text-sm text-pili-concrete">
          Chamados abertos pelos clientes no portal. A ordem de serviço em si é
          emitida no ERP — aqui fica o pedido. {chamados.length} no total,{" "}
          {abertos} em aberto.
        </p>
      </div>

      {semAviso > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">
          <MailWarning className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-medium">
              {semAviso} {semAviso === 1 ? "chamado" : "chamados"} sem aviso por
              e-mail.
            </p>
            <p className="mt-1">
              Nenhum transporte de e-mail está configurado, então nada foi
              enviado para {MAINTENANCE_NOTIFY_EMAIL}. Os chamados estão
              registrados e podem ser notificados em lote assim que o envio for
              habilitado — nenhum se perde.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {chamados.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-pili-mist p-16 text-center">
          <Inbox className="size-10 text-pili-mist" />
          <p className="text-sm text-pili-concrete">
            Nenhum chamado aberto. Os clientes solicitam manutenção pela ficha
            do equipamento, no portal.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {chamados.map((c) => (
            <ChamadoCard
              key={c.id}
              id={c.id}
              number={c.number}
              type={c.type}
              urgency={c.urgency}
              status={c.status}
              description={c.description}
              contactName={c.contactName}
              contactPhone={c.contactPhone}
              internalNote={c.internalNote}
              notificado={!!c.notifiedAt}
              abertoEm={formatDateTime(c.createdAt)}
              equipamento={c.equipment.productName}
              serie={c.equipment.serialNumber}
              local={c.equipment.installedAddress}
              cliente={c.user.name ?? "—"}
              clienteEmail={c.user.email}
              clienteEmpresa={c.user.company}
            />
          ))}
        </div>
      )}
    </div>
  );
}
