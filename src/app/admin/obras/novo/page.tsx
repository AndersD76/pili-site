import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { CaseForm } from "@/components/admin/case-form";
import { Button } from "@/components/ui/button";

export default async function NovaObraPage() {
  await requireRole("ADMIN", "COMERCIAL");

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
            Nova obra
          </h1>
          <p className="text-sm text-pili-cement">
            Preencha os dados da nova obra
          </p>
        </div>
      </div>

      <CaseForm />
    </div>
  );
}
