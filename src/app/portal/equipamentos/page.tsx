import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  ShieldCheck,
  ShieldX,
  Gauge,
  Ruler,
  Weight,
  ArrowRight,
} from "lucide-react";
import { MOCK_EQUIPMENT } from "@/lib/data/portal-mock";
import type { PortalEquipment } from "@/lib/data/portal-mock";

export const metadata: Metadata = {
  title: "Equipamentos",
};

/* ---------- helpers ---------- */

const STATUS_CONFIG: Record<
  PortalEquipment["status"],
  { label: string; className: string }
> = {
  operando: {
    label: "Operando",
    className: "bg-emerald-50 text-emerald-700",
  },
  manutencao: {
    label: "Em manutencao",
    className: "bg-amber-50 text-amber-700",
  },
  parado: {
    label: "Parado",
    className: "bg-red-50 text-red-700",
  },
};

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function isWarrantyValid(warrantyEndsAt: string) {
  return new Date(warrantyEndsAt) > new Date();
}

/* ---------- page ---------- */

export default function EquipamentosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-pili-graphite">
          Equipamentos
        </h1>
        <p className="mt-1 text-base text-pili-concrete">
          Gerencie e acompanhe seus equipamentos PILI
        </p>
      </div>

      {/* Equipment grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {MOCK_EQUIPMENT.map((eq) => {
          const statusInfo = STATUS_CONFIG[eq.status];
          const warrantyValid = isWarrantyValid(eq.warrantyEndsAt);

          return (
            <div
              key={eq.id}
              className="rounded-lg border border-pili-mist bg-pili-white p-6"
            >
              {/* Product name + status badge */}
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold text-pili-graphite">
                    {eq.productName}
                  </h3>
                  <p className="mt-0.5 font-mono text-xs text-pili-cement">
                    {eq.serialNumber}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.className}`}
                >
                  {statusInfo.label}
                </span>
              </div>

              {/* Key specs row */}
              <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-pili-concrete">
                <span className="flex items-center gap-1">
                  <Ruler className="h-3.5 w-3.5" />
                  {eq.length}
                </span>
                <span className="flex items-center gap-1">
                  <Weight className="h-3.5 w-3.5" />
                  {eq.capacity}
                </span>
                <span className="flex items-center gap-1">
                  <Gauge className="h-3.5 w-3.5" />
                  <span className="font-mono text-xs">
                    {eq.operatingHours.toLocaleString("pt-BR")} h
                  </span>
                </span>
              </div>

              {/* Location + date */}
              <div className="mb-4 space-y-1.5 text-sm text-pili-concrete">
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{eq.installedAddress}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  Instalado em {formatDate(eq.installedAt)}
                </p>
              </div>

              {/* Warranty + action */}
              <div className="flex items-center justify-between border-t border-pili-mist pt-4">
                {warrantyValid ? (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                    <ShieldCheck className="h-4 w-4" />
                    Garantia ate {formatDate(eq.warrantyEndsAt)}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-red-700">
                    <ShieldX className="h-4 w-4" />
                    Garantia expirada
                  </span>
                )}

                <Link
                  href={`/portal/equipamentos/${eq.id}`}
                  className="flex items-center gap-1 text-sm font-medium text-pili-safety hover:text-pili-safety-deep"
                >
                  Ver detalhes
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
