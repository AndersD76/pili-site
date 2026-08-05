import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ShieldCheck,
  ShieldX,
  HardDrive,
  Wrench,
  CircleDot,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/* ---------- helpers ---------- */

/**
 * Cor por status. `status` é texto livre no schema, então há um padrão para
 * valores que não conhecemos, em vez de a etiqueta sumir.
 */
const STATUS_CORES: Record<string, string> = {
  ABERTA: "bg-amber-50 text-amber-700",
  AGENDADA: "bg-blue-50 text-blue-700",
  EM_ANDAMENTO: "bg-blue-50 text-blue-700",
  CONCLUIDA: "bg-emerald-50 text-emerald-700",
  CANCELADA: "bg-gray-100 text-gray-500",
  default: "bg-gray-100 text-gray-600",
};

function formatDate(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/* ---------- metadata ---------- */

/**
 * `generateMetadata` roda independente do corpo da página, então precisa da
 * mesma checagem de dono — caso contrário o nome do equipamento de outro
 * cliente vazaria pelo título.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const session = await auth();
  if (!session?.user) return { title: "Equipamento" };

  const { id } = await params;
  const eq = await db.clientEquipment.findFirst({
    where: { id, userId: session.user.id },
    select: { productName: true },
  });

  return { title: eq?.productName ?? "Equipamento" };
}

/* ---------- page ---------- */

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EquipamentoDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/portal/login");

  const { id } = await params;

  // Dono filtrado na consulta: um equipamento de outro cliente é indistinguível
  // de um inexistente.
  const equipment = await db.clientEquipment.findFirst({
    where: { id, userId: session.user.id },
    include: {
      // As ordens de serviço são o motivo de existir um portal de pós-venda:
      // o model e a relação já estavam no schema, mas nenhuma tela os lia.
      serviceOrders: {
        orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }],
        take: 50,
      },
    },
  });

  if (!equipment) notFound();

  const warrantyValid =
    equipment.warrantyEndsAt && equipment.warrantyEndsAt > new Date();

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
            <p className="mt-1 font-mono text-sm text-pili-concrete">
              {equipment.serialNumber}
            </p>
          </div>
          {warrantyValid ? (
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              Garantia ativa
            </span>
          ) : (
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-500">
              <ShieldX className="h-4 w-4" />
              {equipment.warrantyEndsAt ? "Garantia expirada" : "Sem garantia"}
            </span>
          )}
        </div>
      </div>

      {/* ---- Section 2: Info card ---- */}
      <div className="mb-8 rounded-lg border border-pili-mist bg-pili-white p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-pili-graphite">
          Informações gerais
        </h2>

        <dl className="space-y-4">
          <div className="flex items-start gap-3">
            <HardDrive className="mt-0.5 h-4 w-4 shrink-0 text-pili-concrete" />
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-pili-concrete">
                Número de série
              </dt>
              <dd className="mt-0.5 font-mono text-sm text-pili-graphite">
                {equipment.serialNumber}
              </dd>
            </div>
          </div>

          {equipment.installedAddress && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pili-concrete" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-pili-concrete">
                  Local de instalação
                </dt>
                <dd className="mt-0.5 text-sm text-pili-graphite">
                  {equipment.installedAddress}
                </dd>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-pili-concrete" />
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-pili-concrete">
                Data de instalação
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
              <dt className="text-xs font-medium uppercase tracking-wide text-pili-concrete">
                Garantia
              </dt>
              <dd
                className={`mt-0.5 text-sm font-medium ${
                  warrantyValid ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {warrantyValid && equipment.warrantyEndsAt
                  ? `Válida até ${formatDate(equipment.warrantyEndsAt)}`
                  : equipment.warrantyEndsAt
                    ? `Expirada em ${formatDate(equipment.warrantyEndsAt)}`
                    : "Sem informação de garantia"}
              </dd>
            </div>
          </div>
        </dl>
      </div>

      {/* ---- Section 3: Ordens de serviço ---- */}
      <div className="mb-8 rounded-lg border border-pili-mist bg-pili-white p-6">
        <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-pili-graphite">
          <Wrench className="h-5 w-5 text-pili-concrete" />
          Ordens de serviço
        </h2>

        {equipment.serviceOrders.length === 0 ? (
          <p className="text-sm text-pili-concrete">
            Nenhuma ordem de serviço registrada para este equipamento.
          </p>
        ) : (
          <ul className="divide-y divide-pili-mist">
            {equipment.serviceOrders.map((os) => {
              const cor = STATUS_CORES[os.status] ?? STATUS_CORES.default;
              return (
                <li key={os.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-mono text-sm font-medium text-pili-graphite">
                      {os.number}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cor}`}
                    >
                      <CircleDot className="h-3 w-3" />
                      {os.status}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-pili-concrete">
                      {os.type}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-pili-graphite">
                    {os.description}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-pili-concrete">
                    {os.scheduledAt && (
                      <span>Agendada: {formatDate(os.scheduledAt)}</span>
                    )}
                    {os.completedAt && (
                      <span>Concluída: {formatDate(os.completedAt)}</span>
                    )}
                    {!os.scheduledAt && !os.completedAt && (
                      <span>Aberta em {formatDate(os.createdAt)}</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ---- Section 4: Back button ---- */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/portal/equipamentos"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-pili-mist bg-pili-white px-6 py-3 text-sm font-bold text-pili-graphite transition-colors hover:bg-pili-paper"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para equipamentos
        </Link>
      </div>
    </div>
  );
}
