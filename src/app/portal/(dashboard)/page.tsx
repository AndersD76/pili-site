import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  HardDrive,
  FileText,
  ArrowRight,
  ShoppingCart,
  Package,
} from "lucide-react";

export default async function PortalDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/portal/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/portal/login");

  const equipment = await db.clientEquipment.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const warrantyActive = equipment.filter(
    (eq) => eq.warrantyEndsAt && eq.warrantyEndsAt > new Date()
  );

  return (
    <div className="min-h-screen bg-pili-paper">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Welcome header */}
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight text-pili-graphite">
            Bem-vindo, {user.name?.split(" ")[0] ?? "Cliente"}
          </h1>
          {user.company && (
            <p className="mt-1 text-base text-pili-concrete">
              {user.company}
            </p>
          )}
        </div>

        {/* Stats cards row */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Equipamentos */}
          <div className="flex items-center gap-4 rounded-lg border border-pili-mist bg-pili-white p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-pili-paper">
              <HardDrive className="h-6 w-6 text-pili-concrete" />
            </div>
            <div>
              <p className="text-sm font-medium text-pili-concrete">
                Equipamentos
              </p>
              <p className="font-display text-2xl font-bold text-pili-graphite">
                {equipment.length}
              </p>
            </div>
          </div>

          {/* Garantias ativas */}
          <div className="flex items-center gap-4 rounded-lg border border-pili-mist bg-pili-white p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-pili-paper">
              <Package className="h-6 w-6 text-pili-concrete" />
            </div>
            <div>
              <p className="text-sm font-medium text-pili-concrete">
                Garantias ativas
              </p>
              <p className="font-display text-2xl font-bold text-pili-graphite">
                {warrantyActive.length}
              </p>
            </div>
          </div>

          {/* Documentos */}
          <div className="flex items-center gap-4 rounded-lg border border-pili-mist bg-pili-white p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-pili-paper">
              <FileText className="h-6 w-6 text-pili-concrete" />
            </div>
            <div>
              <p className="text-sm font-medium text-pili-concrete">
                Documentos
              </p>
              <p className="font-display text-2xl font-bold text-pili-graphite">
                --
              </p>
            </div>
          </div>
        </div>

        {/* Equipment list */}
        <div className="mb-10 rounded-lg border border-pili-mist bg-pili-white p-6">
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

          {equipment.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pili-paper">
                <HardDrive className="h-8 w-8 text-pili-concrete" />
              </div>
              <p className="mt-4 text-sm font-medium text-pili-concrete">
                Nenhum equipamento cadastrado
              </p>
              <p className="mt-1 text-sm text-pili-concrete">
                Seus equipamentos PILI aparecerão aqui quando forem registrados.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-pili-mist">
              {equipment.slice(0, 5).map((eq) => {
                const warrantyValid =
                  eq.warrantyEndsAt && eq.warrantyEndsAt > new Date();
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
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick actions row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/portal/documentos"
            className="group flex items-center justify-between rounded-lg border border-pili-mist bg-pili-white p-6 transition-colors hover:border-pili-safety"
          >
            <div>
              <h3 className="font-display font-bold text-pili-graphite">
                Ver documentos
              </h3>
              <p className="mt-1 text-sm text-pili-concrete">
                Manuais, certificados e laudos
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-pili-concrete transition-colors group-hover:text-pili-safety" />
          </Link>

          <a
            href="https://store.pili.ind.br"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-lg border border-pili-mist bg-pili-white p-6 transition-colors hover:border-pili-safety"
          >
            <div>
              <h3 className="font-display font-bold text-pili-graphite">
                PILI Store
              </h3>
              <p className="mt-1 text-sm text-pili-concrete">
                Peças de reposição e acessórios
              </p>
            </div>
            <ShoppingCart className="h-5 w-5 shrink-0 text-pili-concrete transition-colors group-hover:text-pili-safety" />
          </a>
        </div>
      </div>
    </div>
  );
}
