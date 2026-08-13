import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { requireRole } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { SetorForm } from "@/components/admin/setor-form";
import { MediaUploader } from "@/components/admin/media-uploader";

export const metadata = { title: "Editar setor" };

export default async function EditarSetorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireRole("ADMIN");

  const { slug } = await params;
  const setor = await db.setor.findUnique({
    where: { slug },
    include: {
      translations: true,
      media: { orderBy: { order: "asc" } },
    },
  });
  if (!setor) notFound();

  const t = await getTranslations({ locale: "pt-BR" });
  const pt = setor.translations.find((tr) => tr.locale === "pt_BR");
  const es = setor.translations.find((tr) => tr.locale === "es");

  // O texto que o site usa hoje, para aparecer como placeholder no formulário.
  const padraoTitulo = t(`forms.applications.${slug}`);
  const padraoDescricao = t(`home.sectors.${slug}`);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-pili-black">
          {pt?.titulo ?? padraoTitulo}
        </h1>
        <p className="mt-1 font-mono text-sm text-pili-concrete">
          /solucoes/{slug}
        </p>
      </div>

      <SetorForm
        slug={setor.slug}
        padraoTitulo={padraoTitulo}
        padraoDescricao={padraoDescricao}
        initial={{
          tituloPt: pt?.titulo ?? "",
          descricaoPt: pt?.descricao ?? "",
          tituloEs: es?.titulo ?? "",
          descricaoEs: es?.descricao ?? "",
          ordem: setor.ordem,
          ativo: setor.ativo,
        }}
      />

      <div className="max-w-2xl rounded-lg border border-pili-mist bg-pili-white p-6">
        <MediaUploader
          setorSlug={setor.slug}
          initialItems={setor.media}
          label="Foto do setor"
          help="A primeira imagem da lista é a foto do cartão. Sem nenhuma, o site usa a foto padrão. O card é alto e estreito (3:4), então prefira uma foto com o assunto no centro."
        />
      </div>
    </div>
  );
}
