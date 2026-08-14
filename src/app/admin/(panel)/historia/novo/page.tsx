import { requireRole } from "@/lib/auth-guard";
import { MarcoForm, MARCO_VAZIO } from "@/components/admin/marco-form";

export const metadata = { title: "Novo marco" };

export default async function NovoMarcoPage() {
  await requireRole("ADMIN");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-pili-black">
          Novo marco
        </h1>
        <p className="mt-1 text-sm text-pili-concrete">
          Atenção: assim que existir um marco cadastrado, a página da empresa
          passa a exibir apenas os marcos daqui, e não mais a trajetória padrão.
        </p>
      </div>

      <MarcoForm initial={MARCO_VAZIO} />
    </div>
  );
}
