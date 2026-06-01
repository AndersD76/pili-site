import {
  MOCK_CLIENT,
  MOCK_EQUIPMENT,
  MOCK_SERVICE_ORDERS,
  MOCK_DOCUMENTS,
} from "@/lib/data/portal-mock";
import Link from "next/link";
import {
  HardDrive,
  Wrench,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";

const equipmentStatusLabel: Record<string, { label: string; className: string }> = {
  operando: { label: "Operando", className: "bg-emerald-50 text-emerald-700" },
  manutencao: { label: "Em manutencao", className: "bg-amber-50 text-amber-700" },
  parado: { label: "Parado", className: "bg-red-50 text-red-700" },
};

const orderStatusLabel: Record<string, { label: string; className: string }> = {
  aberta: { label: "Aberta", className: "bg-blue-50 text-blue-700" },
  agendada: { label: "Agendada", className: "bg-violet-50 text-violet-700" },
  em_andamento: { label: "Em andamento", className: "bg-amber-50 text-amber-700" },
  concluida: { label: "Concluida", className: "bg-emerald-50 text-emerald-700" },
  cancelada: { label: "Cancelada", className: "bg-gray-100 text-gray-500" },
};

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export default function PortalDashboardPage() {
  const openOrders = MOCK_SERVICE_ORDERS.filter(
    (o) => o.status !== "concluida" && o.status !== "cancelada"
  );

  const nextMaintenanceEquipment = [...MOCK_EQUIPMENT].sort(
    (a, b) =>
      new Date(a.nextMaintenance).getTime() -
      new Date(b.nextMaintenance).getTime()
  )[0] as (typeof MOCK_EQUIPMENT)[number] | undefined;

  const recentOrders = [...MOCK_SERVICE_ORDERS]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-pili-paper">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Welcome header */}
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight text-pili-graphite">
            Bem-vindo, {MOCK_CLIENT.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-base text-pili-concrete">
            {MOCK_CLIENT.company}
          </p>
        </div>

        {/* Stats cards row */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Equipamentos */}
          <div className="flex items-center gap-4 rounded-lg border border-pili-mist bg-pili-white p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-pili-paper">
              <HardDrive className="h-6 w-6 text-pili-concrete" />
            </div>
            <div>
              <p className="text-sm font-medium text-pili-cement">
                Equipamentos
              </p>
              <p className="font-display text-2xl font-bold text-pili-graphite">
                {MOCK_EQUIPMENT.length}
              </p>
            </div>
          </div>

          {/* Ordens abertas */}
          <div className="flex items-center gap-4 rounded-lg border border-pili-mist bg-pili-white p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-pili-paper">
              <Wrench className="h-6 w-6 text-pili-concrete" />
            </div>
            <div>
              <p className="text-sm font-medium text-pili-cement">
                Ordens abertas
              </p>
              <p className="font-display text-2xl font-bold text-pili-graphite">
                {openOrders.length}
              </p>
            </div>
          </div>

          {/* Documentos */}
          <div className="flex items-center gap-4 rounded-lg border border-pili-mist bg-pili-white p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-pili-paper">
              <FileText className="h-6 w-6 text-pili-concrete" />
            </div>
            <div>
              <p className="text-sm font-medium text-pili-cement">
                Documentos
              </p>
              <p className="font-display text-2xl font-bold text-pili-graphite">
                {MOCK_DOCUMENTS.length}
              </p>
            </div>
          </div>

          {/* Manutencao proxima */}
          <div className="flex items-center gap-4 rounded-lg border border-pili-mist bg-pili-white p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-pili-paper">
              <Clock className="h-6 w-6 text-pili-concrete" />
            </div>
            <div>
              <p className="text-sm font-medium text-pili-cement">
                Manutencao proxima
              </p>
              <p className="font-display text-lg font-bold text-pili-graphite">
                {nextMaintenanceEquipment
                  ? formatDate(nextMaintenanceEquipment.nextMaintenance)
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Two-column grid */}
        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Equipamentos card */}
          <div className="rounded-lg border border-pili-mist bg-pili-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-pili-graphite">
                Equipamentos
              </h2>
              <Link
                href="/portal/equipamentos"
                className="flex items-center gap-1 text-sm font-medium text-pili-safety hover:text-pili-safety-deep"
              >
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="divide-y divide-pili-mist">
              {MOCK_EQUIPMENT.map((eq) => {
                const statusInfo =
                  equipmentStatusLabel[eq.status] ?? {
                    label: eq.status,
                    className: "bg-gray-100 text-gray-500",
                  };
                return (
                  <Link
                    key={eq.id}
                    href={`/portal/equipamentos/${eq.id}`}
                    className="flex items-center justify-between gap-4 py-4 transition-colors hover:bg-pili-paper first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-pili-graphite">
                        {eq.productName}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-pili-cement">
                        {eq.serialNumber}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Ordens de servico recentes */}
          <div className="rounded-lg border border-pili-mist bg-pili-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-pili-graphite">
                Ordens de servico recentes
              </h2>
              <Link
                href="/portal/servicos"
                className="flex items-center gap-1 text-sm font-medium text-pili-safety hover:text-pili-safety-deep"
              >
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="divide-y divide-pili-mist">
              {recentOrders.map((order) => {
                const statusInfo =
                  orderStatusLabel[order.status] ?? {
                    label: order.status,
                    className: "bg-gray-100 text-gray-500",
                  };
                return (
                  <Link
                    key={order.id}
                    href="/portal/servicos"
                    className="block py-4 transition-colors hover:bg-pili-paper first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-pili-graphite">
                          {order.number}
                        </p>
                        <p className="mt-0.5 truncate text-sm text-pili-cement">
                          {order.equipmentName}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.className}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-pili-cement">
                      {formatDate(order.createdAt)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick actions row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/portal/servicos/novo"
            className="group flex items-center justify-between rounded-lg border border-pili-mist bg-pili-white p-6 transition-colors hover:border-pili-safety"
          >
            <div>
              <h3 className="font-display font-bold text-pili-graphite">
                Solicitar servico
              </h3>
              <p className="mt-1 text-sm text-pili-cement">
                Abra uma nova ordem de servico
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-pili-cement transition-colors group-hover:text-pili-safety" />
          </Link>

          <Link
            href="/portal/documentos"
            className="group flex items-center justify-between rounded-lg border border-pili-mist bg-pili-white p-6 transition-colors hover:border-pili-safety"
          >
            <div>
              <h3 className="font-display font-bold text-pili-graphite">
                Ver documentos
              </h3>
              <p className="mt-1 text-sm text-pili-cement">
                Manuais, certificados e laudos
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-pili-cement transition-colors group-hover:text-pili-safety" />
          </Link>

          <Link
            href="/portal/suporte"
            className="group flex items-center justify-between rounded-lg border border-pili-mist bg-pili-white p-6 transition-colors hover:border-pili-safety"
          >
            <div>
              <h3 className="font-display font-bold text-pili-graphite">
                Falar com suporte
              </h3>
              <p className="mt-1 text-sm text-pili-cement">
                Chat ou abertura de chamado
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-pili-cement transition-colors group-hover:text-pili-safety" />
          </Link>
        </div>
      </div>
    </div>
  );
}
