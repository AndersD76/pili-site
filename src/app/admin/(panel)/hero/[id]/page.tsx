import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { HeroSlideForm } from "@/components/admin/hero-slide-form";
import { MediaUploader } from "@/components/admin/media-uploader";

export const metadata = { title: "Editar slide" };

export default async function EditarHeroSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");

  const { id } = await params;
  const slide = await db.heroSlide.findUnique({
    where: { id },
    include: {
      translations: true,
      media: { orderBy: { order: "asc" } },
    },
  });
  if (!slide) notFound();

  const pt = slide.translations.find((t) => t.locale === "pt_BR");
  const es = slide.translations.find((t) => t.locale === "es");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-pili-black">
          {pt?.titulo ?? "Slide"}
        </h1>
        <p className="mt-1 text-sm text-pili-concrete">
          Slide #{slide.ordem} do carrossel da home.
        </p>
      </div>

      <HeroSlideForm
        id={slide.id}
        initial={{
          tituloPt: pt?.titulo ?? "",
          subtituloPt: pt?.subtitulo ?? "",
          tituloEs: es?.titulo ?? "",
          subtituloEs: es?.subtitulo ?? "",
          ordem: slide.ordem,
          ativo: slide.ativo,
        }}
      />

      <div className="max-w-2xl rounded-lg border border-pili-mist bg-pili-white p-6">
        <MediaUploader
          heroSlideId={slide.id}
          initialItems={slide.media}
          label="Imagem de fundo"
          help="A primeira imagem da lista é o fundo do slide. Use uma foto larga (mínimo 1920x1080): ela ocupa a tela inteira, com um degradê escuro por cima para o título continuar legível."
        />
      </div>
    </div>
  );
}
