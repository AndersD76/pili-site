import Link from "next/link";
import { ImageOff } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { requireRole } from "@/lib/auth-guard";
import { getSetoresAdmin } from "@/lib/setores";
import { mediaUrl } from "@/lib/media";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Setores" };

export default async function SetoresPage() {
  await requireRole("ADMIN");

  const [setores, t] = await Promise.all([
    getSetoresAdmin(),
    getTranslations({ locale: "pt-BR" }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-pili-black">
          Soluções por setor
        </h1>
        <p className="mt-1 text-sm text-pili-concrete">
          Os cinco cartões da home. Foto, título e descrição de cada um. Não é
          possível criar setor novo aqui: cada slug tem uma página própria em
          /solucoes, e um setor sem página viraria um card apontando para lugar
          nenhum.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {setores.map((setor) => {
          const foto = setor.media[0];
          const pt = setor.translations.find((tr) => tr.locale === "pt_BR");
          const temEs = setor.translations.some((tr) => tr.locale === "es");
          const rotuloPadrao = t(`forms.applications.${setor.slug}`);

          return (
            <li
              key={setor.slug}
              className="overflow-hidden rounded-lg border border-pili-mist bg-pili-white"
            >
              <Link href={`/admin/setores/${setor.slug}`} className="block">
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
                      <span className="text-xs">Foto padrão</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-pili-cement">
                      #{setor.ordem}
                    </span>
                    {setor.ativo ? (
                      <Badge>Visível</Badge>
                    ) : (
                      <Badge variant="secondary">Oculto</Badge>
                    )}
                    {!pt && <Badge variant="secondary">Texto padrão</Badge>}
                    {pt && !temEs && (
                      <Badge variant="secondary">Sem espanhol</Badge>
                    )}
                  </div>
                  <p className="mt-2 font-medium text-pili-black">
                    {pt?.titulo ?? rotuloPadrao}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-pili-cement">
                    /solucoes/{setor.slug}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
