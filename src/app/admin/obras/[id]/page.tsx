import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { getCaseById } from "../actions";
import { CaseForm } from "@/components/admin/case-form";
import { Button } from "@/components/ui/button";

export default async function EditarObraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN", "COMERCIAL");

  const { id } = await params;
  const { data: caseItem, error } = await getCaseById(id);

  if (!caseItem || error) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/obras">
            <ArrowLeft className="size-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-pili-black">
            Editar obra
          </h1>
          <p className="text-sm text-pili-cement">
            Atualize os dados da obra
          </p>
        </div>
      </div>

      <CaseForm caseData={caseItem} />
    </div>
  );
}
