import type { Metadata } from "next";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentos",
};

export default function DocumentosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-pili-graphite">
          Documentos
        </h1>
        <p className="mt-1 text-base text-pili-concrete">
          Manuais, certificados, laudos e desenhos tecnicos
        </p>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center rounded-lg border border-pili-mist bg-pili-white py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pili-paper">
          <FileText className="h-8 w-8 text-pili-cement" />
        </div>
        <p className="mt-4 text-base font-medium text-pili-concrete">
          Seus documentos estarao disponiveis em breve
        </p>
        <p className="mt-1 max-w-sm text-sm text-pili-cement">
          Manuais, certificados de garantia e laudos tecnicos dos seus
          equipamentos aparecerao aqui.
        </p>
      </div>
    </div>
  );
}
