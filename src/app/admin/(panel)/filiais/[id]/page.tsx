import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { FilialForm } from "@/components/admin/filial-form";

export const metadata = { title: "Editar unidade" };

export default async function EditarFilialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");

  const { id } = await params;
  const filial = await db.filial.findUnique({ where: { id } });
  if (!filial) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-pili-black">
          {filial.nome}
        </h1>
        <p className="mt-1 text-sm text-pili-concrete">
          {filial.cidade}/{filial.uf}
        </p>
      </div>

      <FilialForm
        id={filial.id}
        initial={{
          nome: filial.nome,
          tipo: filial.tipo,
          cidade: filial.cidade,
          uf: filial.uf,
          endereco: filial.endereco,
          cep: filial.cep ?? "",
          telefone: filial.telefone ?? "",
          lat: filial.lat === null ? "" : String(filial.lat),
          lng: filial.lng === null ? "" : String(filial.lng),
          ordem: filial.ordem,
          ativa: filial.ativa,
        }}
      />
    </div>
  );
}
