import Link from "next/link";
import { Plus, Wrench, Calendar, CheckCircle2, User } from "lucide-react";
import { MOCK_SERVICE_ORDERS } from "@/lib/data/portal-mock";
import type { PortalServiceOrder } from "@/lib/data/portal-mock";

/* ---------- helpers ---------- */

const TYPE_CONFIG: Record<
  PortalServiceOrder["type"],
  { label: string; bg: string; text: string }
> = {
  preventiva: {
    label: "Preventiva",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  corretiva: {
    label: "Corretiva",
    bg: "bg-red-50",
    text: "text-red-700",
  },
  instalacao: {
    label: "Instalacao",
    bg: "bg-violet-50",
    text: "text-violet-700",
  },
  calibracao: {
    label: "Calibracao",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
  },
};

const STATUS_CONFIG: Record<
  PortalServiceOrder["status"],
  { label: string; bg: string; text: string }
> = {
  aberta: {
    label: "Aberta",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  agendada: {
    label: "Agendada",
    bg: "bg-violet-50",
    text: "text-violet-700",
  },
  em_andamento: {
    label: "Em andamento",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  concluida: {
    label: "Concluida",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  cancelada: {
    label: "Cancelada",
    bg: "bg-gray-100",
    text: "text-gray-500",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/* ---------- badge ---------- */

function Badge({
  label,
  bg,
  text,
}: {
  label: string;
  bg: string;
  text: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${bg} ${text}`}
    >
      {label}
    </span>
  );
}

/* ---------- card ---------- */

function OrderCard({ order }: { order: PortalServiceOrder }) {
  const type = TYPE_CONFIG[order.type];
  const status = STATUS_CONFIG[order.status];

  return (
    <div className="bg-pili-white border border-pili-mist rounded-lg p-6 flex flex-col gap-4">
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-base font-bold text-pili-black">
            {order.number}
          </span>
          <Badge {...type} />
        </div>
        <Badge {...status} />
      </div>

      {/* equipment */}
      <p className="text-sm font-medium text-pili-iron">
        {order.equipmentName}
      </p>

      {/* description */}
      <p className="text-sm text-pili-concrete line-clamp-2">
        {order.description}
      </p>

      {/* dates */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-pili-cement">
        <span className="flex items-center gap-1">
          <Calendar className="size-3.5" />
          Criado em {formatDate(order.createdAt)}
        </span>
        {order.scheduledAt && (
          <span className="flex items-center gap-1">
            <Wrench className="size-3.5" />
            Agendado para {formatDate(order.scheduledAt)}
          </span>
        )}
        {order.completedAt && (
          <span className="flex items-center gap-1">
            <CheckCircle2 className="size-3.5" />
            Concluido em {formatDate(order.completedAt)}
          </span>
        )}
      </div>

      {/* technician */}
      {order.technician && (
        <p className="flex items-center gap-1.5 text-xs text-pili-concrete">
          <User className="size-3.5" />
          {order.technician}
        </p>
      )}

      {/* notes */}
      {order.notes && (
        <div className="rounded-md bg-pili-paper px-4 py-3 text-xs text-pili-iron leading-relaxed">
          {order.notes}
        </div>
      )}
    </div>
  );
}

/* ---------- page ---------- */

export default function ServicosPage() {
  const active = MOCK_SERVICE_ORDERS.filter((o) =>
    ["aberta", "agendada", "em_andamento"].includes(o.status)
  );
  const history = MOCK_SERVICE_ORDERS.filter((o) =>
    ["concluida", "cancelada"].includes(o.status)
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-pili-black">
          Ordens de servico
        </h1>
        <Link
          href="/portal/servicos/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-pili-safety px-5 py-2.5 text-sm font-semibold text-pili-white transition-colors hover:bg-pili-safety-deep"
        >
          <Plus className="size-4" />
          Nova solicitacao
        </Link>
      </div>

      {/* em andamento */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-pili-iron">
          Em andamento
        </h2>
        {active.length === 0 ? (
          <p className="text-sm text-pili-cement">
            Nenhuma ordem em andamento.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {active.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>

      {/* historico */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-pili-iron">
          Historico
        </h2>
        {history.length === 0 ? (
          <p className="text-sm text-pili-cement">
            Nenhuma ordem concluida ou cancelada.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {history.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
