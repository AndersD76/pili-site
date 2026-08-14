import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { MarcoForm } from "@/components/admin/marco-form";

export const metadata = { title: "Editar marco" };

export default async function EditarMarcoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");

  const { id } = await params;
  const marco = await db.marcoHistoria.findUnique({
    where: { id },
    include: { translations: true },
  });
  if (!marco) notFound();

  const pt = marco.translations.find((t) => t.locale === "pt_BR");
  const es = marco.translations.find((t) => t.locale === "es");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-pili-black">
          {pt?.titulo ?? "Marco"}
        </h1>
        <p className="mt-1 font-mono text-sm text-pili-concrete">
          {marco.ano ?? "Hoje"}
        </p>
      </div>

      <MarcoForm
        id={marco.id}
        initial={{
          ano: marco.ano ?? "",
          tituloPt: pt?.titulo ?? "",
          textoPt: pt?.texto ?? "",
          tituloEs: es?.titulo ?? "",
          textoEs: es?.texto ?? "",
          ordem: marco.ordem,
          ativo: marco.ativo,
        }}
      />
    </div>
  );
}
