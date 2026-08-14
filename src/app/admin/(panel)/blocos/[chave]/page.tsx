import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { requireRole } from "@/lib/auth-guard";
import { getBlocoAdmin } from "@/lib/conteudo-editavel";
import { BlocoForm } from "@/components/admin/bloco-form";
import { MediaUploader } from "@/components/admin/media-uploader";

export const metadata = { title: "Bloco da home" };

/** Rótulos de cada bloco e as chaves de mensagem que ele sobrescreve. */
const BLOCOS: Record<
  string,
  { nome: string; onde: string; chaves: { titulo: string; subtitulo: string; texto: string } }
> = {
  ecossistema: {
    nome: "Ecossistema PILI",
    onde: "Seção do ecossistema na home",
    chaves: {
      titulo: "sections.ecosystem",
      subtitulo: "ecossistema.ownTech",
      texto: "ecossistema.intro",
    },
  },
};

export default async function BlocoPage({
  params,
}: {
  params: Promise<{ chave: string }>;
}) {
  await requireRole("ADMIN");

  const { chave } = await params;
  const meta = BLOCOS[chave];
  if (!meta) notFound();

  const bloco = await getBlocoAdmin(chave);
  if (!bloco) notFound();

  const t = await getTranslations({ locale: "pt-BR" });
  const pt = bloco.translations.find((tr) => tr.locale === "pt_BR");
  const es = bloco.translations.find((tr) => tr.locale === "es");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-pili-black">
          {meta.nome}
        </h1>
        <p className="mt-1 text-sm text-pili-concrete">{meta.onde}</p>
      </div>

      <BlocoForm
        chave={chave}
        padrao={{
          titulo: t(meta.chaves.titulo),
          subtitulo: t(meta.chaves.subtitulo),
          texto: t(meta.chaves.texto),
        }}
        initial={{
          tituloPt: pt?.titulo ?? "",
          subtituloPt: pt?.subtitulo ?? "",
          textoPt: pt?.texto ?? "",
          tituloEs: es?.titulo ?? "",
          subtituloEs: es?.subtitulo ?? "",
          textoEs: es?.texto ?? "",
        }}
      />

      <div className="max-w-2xl rounded-lg border border-pili-mist bg-pili-white p-6">
        <MediaUploader
          blocoChave={chave}
          initialItems={bloco.media}
          label="Imagem da seção"
          help="A primeira imagem da lista entra como fundo da seção, sob um véu escuro para o texto continuar legível. Sem imagem, a seção fica no fundo preto atual."
        />
      </div>
    </div>
  );
}
