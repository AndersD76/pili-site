import type { Metadata } from "next";
import { MOCK_DOCUMENTS } from "@/lib/data/portal-mock";
import type { PortalDocument } from "@/lib/data/portal-mock";
import { FileText, File, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentos",
};

const CATEGORY_LABELS: Record<PortalDocument["category"], string> = {
  manual: "Manuais",
  certificado: "Certificados e laudos",
  relatorio: "Relatórios",
  desenho: "Desenhos técnicos",
  garantia: "Garantias",
};

const CATEGORY_ORDER: PortalDocument["category"][] = [
  "manual",
  "certificado",
  "relatorio",
  "desenho",
  "garantia",
];

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function DocumentRow({ doc }: { doc: PortalDocument }) {
  const isPdf = doc.type === "PDF";
  const Icon = isPdf ? FileText : File;

  return (
    <div className="flex items-center gap-4 rounded-lg border border-pili-mist bg-pili-white px-4 py-3 transition-colors hover:bg-pili-paper sm:px-6">
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pili-paper">
        <Icon className="h-5 w-5 text-pili-concrete" />
      </div>

      {/* Name + equipment */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-pili-graphite">{doc.name}</p>
        {doc.equipmentName && (
          <p className="mt-0.5 truncate text-sm text-pili-cement">
            {doc.equipmentName}
          </p>
        )}
      </div>

      {/* Type badge */}
      <span
        className={`hidden shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium sm:inline-flex ${
          isPdf
            ? "bg-blue-50 text-blue-700"
            : "bg-emerald-50 text-emerald-700"
        }`}
      >
        {doc.type}
      </span>

      {/* Size */}
      <span className="hidden shrink-0 text-sm text-pili-cement lg:inline">
        {doc.size}
      </span>

      {/* Date */}
      <span className="hidden shrink-0 text-sm text-pili-cement xl:inline">
        {formatDate(doc.updatedAt)}
      </span>

      {/* Download */}
      <a
        href={doc.url}
        title={`Baixar ${doc.name}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-pili-concrete transition-colors hover:bg-pili-paper hover:text-pili-safety"
      >
        <Download className="h-4 w-4" />
      </a>
    </div>
  );
}

function DocumentCard({ doc }: { doc: PortalDocument }) {
  const isPdf = doc.type === "PDF";
  const Icon = isPdf ? FileText : File;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-pili-mist bg-pili-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pili-paper">
        <Icon className="h-5 w-5 text-pili-concrete" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-pili-graphite">{doc.name}</p>
        {doc.equipmentName && (
          <p className="mt-0.5 text-sm text-pili-cement">
            {doc.equipmentName}
          </p>
        )}
        <div className="mt-2 flex items-center gap-3">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              isPdf
                ? "bg-blue-50 text-blue-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {doc.type}
          </span>
          <span className="text-xs text-pili-cement">{doc.size}</span>
          <span className="text-xs text-pili-cement">
            {formatDate(doc.updatedAt)}
          </span>
        </div>
      </div>
      <a
        href={doc.url}
        title={`Baixar ${doc.name}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-pili-concrete transition-colors hover:bg-pili-paper hover:text-pili-safety"
      >
        <Download className="h-4 w-4" />
      </a>
    </div>
  );
}

export default function DocumentosPage() {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    docs: MOCK_DOCUMENTS.filter((d) => d.category === cat),
  })).filter((g) => g.docs.length > 0);

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-pili-graphite">
          Documentos
        </h1>
        <p className="mt-1 text-base text-pili-concrete">
          Manuais, certificados, laudos e desenhos tecnicos
        </p>
      </div>

      {/* Category sections */}
      <div className="space-y-10">
        {grouped.map((group) => (
          <section key={group.category}>
            <h2 className="mb-4 font-display text-lg font-bold text-pili-graphite">
              {group.label}
            </h2>

            {/* Desktop: row layout */}
            <div className="hidden space-y-2 sm:block">
              {group.docs.map((doc) => (
                <DocumentRow key={doc.id} doc={doc} />
              ))}
            </div>

            {/* Mobile: card layout */}
            <div className="space-y-3 sm:hidden">
              {group.docs.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
