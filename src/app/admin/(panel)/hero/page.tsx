import Link from "next/link";
import { Plus, ImageOff } from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { getHeroSlidesAdmin } from "@/lib/hero-slides";
import { mediaUrl } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Carrossel da home" };

export default async function HeroPage() {
  await requireRole("ADMIN");

  const slides = await getHeroSlidesAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-pili-black">
            Carrossel da home
          </h1>
          <p className="mt-1 text-sm text-pili-concrete">
            Imagens de fundo e títulos que passam no topo da home. Sem nenhum
            slide ativo, a home usa a imagem e o título padrão.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/hero/novo">
            <Plus className="mr-2 size-4" />
            Novo slide
          </Link>
        </Button>
      </div>

      {slides.length === 0 ? (
        <div className="rounded-lg border border-dashed border-pili-mist p-12 text-center">
          <p className="text-sm text-pili-concrete">
            Nenhum slide cadastrado. A home está exibindo a imagem de fundo
            padrão.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slides.map((slide) => {
            const foto = slide.media[0];
            const pt = slide.translations.find((t) => t.locale === "pt_BR");
            const temEs = slide.translations.some((t) => t.locale === "es");

            return (
              <li
                key={slide.id}
                className="overflow-hidden rounded-lg border border-pili-mist bg-pili-white"
              >
                <Link href={`/admin/hero/${slide.id}`} className="block">
                  <div className="relative aspect-video bg-pili-fog">
                    {foto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mediaUrl(foto.id)}
                        alt={foto.alt ?? ""}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-pili-cement">
                        <ImageOff className="h-6 w-6" />
                        <span className="text-xs">Sem imagem</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] text-pili-cement">
                        #{slide.ordem}
                      </span>
                      {slide.ativo ? (
                        <Badge>Visível</Badge>
                      ) : (
                        <Badge variant="secondary">Oculto</Badge>
                      )}
                      {!foto && <Badge variant="secondary">Falta imagem</Badge>}
                      {!temEs && <Badge variant="secondary">Sem espanhol</Badge>}
                    </div>
                    <p className="mt-2 line-clamp-2 font-medium text-pili-black">
                      {pt?.titulo ?? "(sem título)"}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
