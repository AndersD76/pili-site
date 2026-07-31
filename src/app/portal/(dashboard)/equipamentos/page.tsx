import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  ShieldCheck,
  ShieldX,
  ArrowRight,
  HardDrive,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Equipamentos",
};

function formatDate(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function EquipamentosPage() {
  const session = await auth();
  if (!session?.user) redirect("/portal/login");

  const equipment = await db.clientEquipment.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

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

      {equipment.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-pili-mist bg-pili-white py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pili-paper">
            <HardDrive className="h-8 w-8 text-pili-concrete" />
          </div>
          <p className="mt-4 text-base font-medium text-pili-concrete">
            Nenhum equipamento cadastrado
          </p>
          <p className="mt-1 max-w-sm text-sm text-pili-concrete">
            Seus equipamentos PILI aparecerão aqui quando forem registrados pela
            nossa equipe.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {equipment.map((eq) => {
            const warrantyValid =
              eq.warrantyEndsAt && eq.warrantyEndsAt > new Date();

            return (
              <div
                key={eq.id}
                className="rounded-lg border border-pili-mist bg-pili-white p-6"
              >
                {/* Product name + warranty badge */}
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold text-pili-graphite">
                      {eq.productName}
                    </h3>
                    <p className="mt-0.5 font-mono text-xs text-pili-concrete">
                      {eq.serialNumber}
                    </p>
                  </div>
                  {warrantyValid ? (
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      Garantia ativa
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                      Sem garantia
                    </span>
                  )}
                </div>

                {/* Location + date */}
                <div className="mb-4 space-y-1.5 text-sm text-pili-concrete">
                  {eq.installedAddress && (
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{eq.installedAddress}</span>
                    </p>
                  )}
                  <p className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    Instalado em {formatDate(eq.installedAt)}
                  </p>
                </div>

                {/* Warranty + action */}
                <div className="flex items-center justify-between border-t border-pili-mist pt-4">
                  {warrantyValid && eq.warrantyEndsAt ? (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                      <ShieldCheck className="h-4 w-4" />
                      Garantia ate {formatDate(eq.warrantyEndsAt)}
                    </span>
                  ) : eq.warrantyEndsAt ? (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-red-700">
                      <ShieldX className="h-4 w-4" />
                      Garantia expirada
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-pili-concrete">
                      <ShieldX className="h-4 w-4" />
                      Sem garantia
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
      )}
    </div>
  );
}
