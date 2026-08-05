import type { Metadata } from "next";
import { FileText, Download, HardDrive } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Documentos",
};

const TIPO_LABEL: Record<string, string> = {
  CIVIL: "Projeto Civil",
  ELETRICO: "Projeto Elétrico",
  HIDRAULICO: "Projeto Hidráulico",
  MANUAL: "Manual",
  CERTIFICADO: "Certificado",
  LAUDO: "Laudo",
};

const TIPO_COR: Record<string, string> = {
  CIVIL: "bg-blue-50 text-blue-700",
  ELETRICO: "bg-amber-50 text-amber-700",
  HIDRAULICO: "bg-cyan-50 text-cyan-700",
  MANUAL: "bg-gray-100 text-gray-700",
  CERTIFICADO: "bg-emerald-50 text-emerald-700",
  LAUDO: "bg-purple-50 text-purple-700",
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function DocumentosPage() {
  const session = await auth();
  if (!session?.user) redirect("/portal/login");

  const equipment = await db.clientEquipment.findMany({
    where: { userId: session.user.id },
    include: {
      documents: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalDocs = equipment.reduce((s, eq) => s + eq.documents.length, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-pili-graphite">
          Documentos
        </h1>
        <p className="mt-1 text-base text-pili-concrete">
          Projetos, manuais, certificados e laudos técnicos
        </p>
      </div>

      {totalDocs === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-pili-mist bg-pili-white py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pili-paper">
            <FileText className="h-8 w-8 text-pili-concrete" />
          </div>
          <p className="mt-4 text-base font-medium text-pili-concrete">
            Seus documentos estarão disponíveis em breve
          </p>
          <p className="mt-1 max-w-sm text-sm text-pili-concrete">
            Projetos civil, elétrico, hidráulico, manuais e certificados dos
            seus equipamentos aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {equipment
            .filter((eq) => eq.documents.length > 0)
            .map((eq) => (
              <div
                key={eq.id}
                className="rounded-lg border border-pili-mist bg-pili-white p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <HardDrive className="h-5 w-5 text-pili-concrete" />
                  <div>
                    <h2 className="font-display text-lg font-bold text-pili-graphite">
                      {eq.productName}
                    </h2>
                    <p className="font-mono text-xs text-pili-concrete">
                      {eq.serialNumber}
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-pili-mist">
                  {eq.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-4 w-4 shrink-0 text-pili-concrete" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-pili-graphite">
                            {doc.title}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${TIPO_COR[doc.type] || "bg-gray-100 text-gray-700"}`}
                            >
                              {TIPO_LABEL[doc.type] || doc.type}
                            </span>
                            <span className="text-xs text-pili-concrete">
                              {formatSize(doc.size)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <a
                        href={`/api/portal/documentos/${doc.id}`}
                        download={doc.filename}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-pili-mist px-3 py-2 text-sm font-medium text-pili-graphite transition-colors hover:bg-pili-paper"
                      >
                        <Download className="h-4 w-4" />
                        Baixar
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
