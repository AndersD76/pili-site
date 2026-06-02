import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ShieldCheck,
  ShieldX,
  Gauge,
  Wrench,
  Clock,
  FileText,
  File,
  Download,
} from "lucide-react";
import {
  getEquipment,
  getServiceOrdersForEquipment,
  getDocumentsForEquipment,
} from "@/lib/data/portal-mock";
import type { PortalEquipment, PortalServiceOrder } from "@/lib/data/portal-mock";

/* ---------- helpers ---------- */

const STATUS_CONFIG: Record<
  PortalEquipment["status"],
  { label: string; bg: string; text: string; dot: string }
> = {
  operando: {
    label: "Operando",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  manutencao: {
    label: "Em manutencao",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  parado: {
    label: "Parado",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
};

const ORDER_TYPE_LABELS: Record<PortalServiceOrder["type"], string> = {
  preventiva: "Preventiva",
  corretiva: "Corretiva",
  instalacao: "Instalacao",
  calibracao: "Calibracao",
};

const ORDER_STATUS_CONFIG: Record<
  PortalServiceOrder["status"],
  { label: string; className: string }
> = {
  aberta: { label: "Aberta", className: "bg-blue-50 text-blue-700" },
  agendada: { label: "Agendada", className: "bg-violet-50 text-violet-700" },
  em_andamento: {
    label: "Em andamento",
    className: "bg-amber-50 text-amber-700",
  },
  concluida: {
    label: "Concluida",
    className: "bg-emerald-50 text-emerald-700",
  },
  cancelada: { label: "Cancelada", className: "bg-gray-100 text-gray-500" },
};

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function isWarrantyValid(warrantyEndsAt: string) {
  return new Date(warrantyEndsAt) > new Date();
}

function daysUntil(dateStr: string) {
  const diff =
    new Date(dateStr).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/* ---------- metadata ---------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const eq = getEquipment(id);
  if (!eq) return { title: "Equipamento" };
  return { title: eq.productName };
}

/* ---------- page ---------- */

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EquipamentoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const equipment = getEquipment(id);
  if (!equipment) notFound();

  const serviceOrders = getServiceOrdersForEquipment(id);
  const documents = getDocumentsForEquipment(id);
  const statusInfo = STATUS_CONFIG[equipment.status];
  const warrantyValid = isWarrantyValid(equipment.warrantyEndsAt);
  const maintenanceDays = daysUntil(equipment.nextMaintenance);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ---- Section 1: Header ---- */}
      <div className="mb-8">
        <Link
          href="/portal/equipamentos"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-pili-concrete hover:text-pili-graphite"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para equipamentos
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-pili-graphite sm:text-3xl">
              {equipment.productName}
            </h1>
            <p className="mt-1 font-mono text-sm text-pili-cement">
              {equipment.serialNumber}
            </p>
          </div>
          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}
          >
            <span className={`h-2 w-2 rounded-full ${statusInfo.dot}`} />
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* ---- Section 2: Info grid ---- */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left card: Informacoes gerais */}
        <div className="rounded-lg border border-pili-mist bg-pili-white p-6">
          <h2 className="mb-5 font-display text-lg font-bold text-pili-graphite">
            Informacoes gerais
          </h2>

          <dl className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pili-cement" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-pili-cement">
                  Local de instalacao
                </dt>
                <dd className="mt-0.5 text-sm text-pili-graphite">
                  {equipment.installedAddress}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-pili-cement" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-pili-cement">
                  Data de instalacao
                </dt>
                <dd className="mt-0.5 text-sm text-pili-graphite">
                  {formatDate(equipment.installedAt)}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {warrantyValid ? (
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <ShieldX className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              )}
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-pili-cement">
                  Garantia
                </dt>
                <dd
                  className={`mt-0.5 text-sm font-medium ${
                    warrantyValid ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {warrantyValid
                    ? `Valida ate ${formatDate(equipment.warrantyEndsAt)}`
                    : `Expirada em ${formatDate(equipment.warrantyEndsAt)}`}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-pili-cement" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-pili-cement">
                  Horas de operacao
                </dt>
                <dd className="mt-0.5 font-mono text-sm text-pili-graphite">
                  {equipment.operatingHours.toLocaleString("pt-BR")} h
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-pili-cement" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-pili-cement">
                  Ultima manutencao
                </dt>
                <dd className="mt-0.5 text-sm text-pili-graphite">
                  {formatDate(equipment.lastMaintenance)}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-pili-cement" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-pili-cement">
                  Proxima manutencao
                </dt>
                <dd className="mt-0.5 text-sm text-pili-graphite">
                  {formatDate(equipment.nextMaintenance)}
                </dd>
              </div>
            </div>
          </dl>
        </div>

        {/* Right card: Status operacional */}
        <div className="rounded-lg border border-pili-mist bg-pili-white p-6">
          <h2 className="mb-5 font-display text-lg font-bold text-pili-graphite">
            Status operacional
          </h2>

          {/* Large status indicator */}
          <div
            className={`mb-6 flex items-center gap-3 rounded-lg p-4 ${statusInfo.bg}`}
          >
            <span className={`h-4 w-4 rounded-full ${statusInfo.dot}`} />
            <span className={`text-lg font-bold ${statusInfo.text}`}>
              {statusInfo.label}
            </span>
          </div>

          {/* Operating hours progress */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-pili-concrete">
                Horas de operacao
              </span>
              <span className="font-mono text-pili-graphite">
                {equipment.operatingHours.toLocaleString("pt-BR")} h
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-pili-paper">
              <div
                className="h-full rounded-full bg-pili-steel transition-all"
                style={{
                  width: `${Math.min(
                    (equipment.operatingHours / 30000) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <p className="mt-1 text-xs text-pili-cement">
              Referencia: 30.000 h (revisao geral)
            </p>
          </div>

          {/* Maintenance countdown */}
          <div className="rounded-lg border border-pili-mist bg-pili-paper p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-pili-cement">
              Proxima manutencao
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-pili-graphite">
              {maintenanceDays > 0 ? (
                <>
                  {maintenanceDays}{" "}
                  <span className="text-base font-medium text-pili-concrete">
                    {maintenanceDays === 1 ? "dia" : "dias"}
                  </span>
                </>
              ) : (
                <span className="text-amber-700">Manutencao atrasada</span>
              )}
            </p>
            <p className="mt-1 text-sm text-pili-cement">
              Agendada para {formatDate(equipment.nextMaintenance)}
            </p>
          </div>
        </div>
      </div>

      {/* ---- Section 3: Specifications table ---- */}
      <div className="mb-8 rounded-lg border border-pili-mist bg-pili-white p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-pili-graphite">
          Especificacoes tecnicas
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pili-mist">
                <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-pili-cement">
                  Especificacao
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wide text-pili-cement">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pili-mist">
              {equipment.specs.map((spec) => (
                <tr key={spec.label}>
                  <td className="py-3 pr-4 font-medium text-pili-graphite">
                    {spec.label}
                  </td>
                  <td className="py-3 font-mono text-sm text-pili-concrete">
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- Section 4: Documents ---- */}
      <div className="mb-8 rounded-lg border border-pili-mist bg-pili-white p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-pili-graphite">
          Documentos
        </h2>

        {documents.length === 0 ? (
          <p className="text-sm text-pili-cement">
            Nenhum documento disponivel para este equipamento.
          </p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => {
              const isPdf = doc.type === "PDF";
              const Icon = isPdf ? FileText : File;

              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 rounded-lg border border-pili-mist bg-pili-paper px-4 py-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pili-white">
                    <Icon className="h-5 w-5 text-pili-concrete" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-pili-graphite">
                      {doc.name}
                    </p>
                    <p className="mt-0.5 text-xs text-pili-cement">
                      {doc.type} — {doc.size}
                    </p>
                  </div>
                  <a
                    href={doc.url}
                    className="flex shrink-0 items-center gap-1.5 rounded-md border border-pili-mist bg-pili-white px-3 py-1.5 text-sm font-medium text-pili-concrete transition-colors hover:border-pili-concrete hover:text-pili-graphite"
                  >
                    <Download className="h-4 w-4" />
                    Baixar
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ---- Section 5: Service order history ---- */}
      <div className="mb-8 rounded-lg border border-pili-mist bg-pili-white p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-pili-graphite">
          Historico de ordens de servico
        </h2>

        {serviceOrders.length === 0 ? (
          <p className="text-sm text-pili-cement">
            Nenhuma ordem de servico registrada para este equipamento.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pili-mist">
                  <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-pili-cement">
                    Numero
                  </th>
                  <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-pili-cement">
                    Tipo
                  </th>
                  <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-pili-cement">
                    Status
                  </th>
                  <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-pili-cement">
                    Data
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wide text-pili-cement">
                    Tecnico
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pili-mist">
                {serviceOrders.map((order) => {
                  const orderStatus = ORDER_STATUS_CONFIG[order.status];
                  return (
                    <tr key={order.id}>
                      <td className="py-3 pr-4 font-mono text-sm text-pili-graphite">
                        {order.number}
                      </td>
                      <td className="py-3 pr-4 text-pili-graphite">
                        {ORDER_TYPE_LABELS[order.type]}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${orderStatus.className}`}
                        >
                          {orderStatus.label}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-pili-concrete">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3 text-pili-concrete">
                        {order.technician ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---- Section 6: Action buttons ---- */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/portal/servicos/novo"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-pili-safety px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-pili-safety-deep"
        >
          <Wrench className="h-4 w-4" />
          Solicitar manutencao
        </Link>
        <button
          disabled
          className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-pili-mist bg-pili-white px-6 py-3 text-sm font-bold text-pili-cement"
        >
          <Download className="h-4 w-4" />
          Baixar manual
        </button>
      </div>
    </div>
  );
}
