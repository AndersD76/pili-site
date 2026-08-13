import { requireRole } from "@/lib/auth-guard";
import { FilialForm, FILIAL_VAZIA } from "@/components/admin/filial-form";

export const metadata = { title: "Nova unidade" };

export default async function NovaFilialPage() {
  await requireRole("ADMIN");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-pili-black">
          Nova unidade
        </h1>
        <p className="mt-1 text-sm text-pili-concrete">
          Filiais, escritórios comerciais e assistências técnicas aparecem no
          rodapé de todas as páginas do site.
        </p>
      </div>

      <FilialForm initial={FILIAL_VAZIA} />
    </div>
  );
}
