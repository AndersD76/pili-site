"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Building2, Globe, Loader2, MapPin, Share2 } from "lucide-react";
import {
  updateSiteSettings,
  siteSettingsSchema,
  type SiteSettingsInput,
} from "@/app/admin/(panel)/config/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Edição dos dados institucionais.
 *
 * A tela antes só exibia valores vindos de `constants.ts` — para trocar um
 * telefone era preciso commit e deploy.
 */
export function SiteSettingsForm({ initial }: { initial: SiteSettingsInput }) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: initial,
  });

  function onSubmit(values: SiteSettingsInput) {
    startTransition(async () => {
      try {
        const result = await updateSiteSettings(values);
        if (result.success) {
          toast.success("Configurações salvas. O site já reflete a mudança.");
        } else {
          toast.error(result.error ?? "Erro ao salvar.");
        }
      } catch {
        toast.error("Não foi possível salvar as configurações.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ---- Dados da empresa ---- */}
        <section className="rounded-lg border border-pili-mist bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <Building2 className="h-5 w-5 text-pili-safety" />
            <h2 className="font-display text-lg font-bold text-pili-black">
              Dados da empresa
            </h2>
          </div>

          <div className="space-y-4">
            <Campo id="razaoSocial" label="Razão social" register={register} error={errors.razaoSocial?.message} />
            <Campo id="cnpj" label="CNPJ" register={register} error={errors.cnpj?.message} />
            <Campo id="endereco" label="Endereço" register={register} error={errors.endereco?.message} />
            <Campo id="telefone" label="Telefone" register={register} error={errors.telefone?.message} />
            <Campo id="whatsapp" label="WhatsApp" register={register} error={errors.whatsapp?.message} />
            <Campo id="email" label="E-mail" type="email" register={register} error={errors.email?.message} />
            <Campo id="emailComercial" label="E-mail comercial" type="email" register={register} error={errors.emailComercial?.message} />
            <Campo id="fundacao" label="Ano de fundação" type="number" register={register} error={errors.fundacao?.message} />
          </div>
        </section>

        <div className="space-y-6">
          {/* ---- Redes sociais ---- */}
          <section className="rounded-lg border border-pili-mist bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <Share2 className="h-5 w-5 text-pili-safety" />
              <h2 className="font-display text-lg font-bold text-pili-black">
                Redes sociais
              </h2>
            </div>
            <div className="space-y-4">
              <Campo id="instagram" label="Instagram" register={register} error={errors.instagram?.message} />
              <Campo id="linkedin" label="LinkedIn" register={register} error={errors.linkedin?.message} />
              <Campo id="facebook" label="Facebook" register={register} error={errors.facebook?.message} />
              <Campo id="youtube" label="YouTube" register={register} error={errors.youtube?.message} />
            </div>
          </section>

          {/* ---- Ecossistema ---- */}
          <section className="rounded-lg border border-pili-mist bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <Globe className="h-5 w-5 text-pili-safety" />
              <h2 className="font-display text-lg font-bold text-pili-black">
                Ecossistema
              </h2>
            </div>
            <Campo id="piliTechUrl" label="PILI Tech" register={register} error={errors.piliTechUrl?.message} />
          </section>

          {/* ---- Mapa ---- */}
          <section className="rounded-lg border border-pili-mist bg-white p-6">
            <div className="mb-2 flex items-center gap-3">
              <MapPin className="h-5 w-5 text-pili-safety" />
              <h2 className="font-display text-lg font-bold text-pili-black">
                Mapa da página de contato
              </h2>
            </div>
            <p className="mb-5 text-sm text-pili-concrete">
              Use OpenStreetMap (gratuito, sem chave). Para achar as
              coordenadas, clique com o botão direito no ponto em{" "}
              <a
                href="https://www.openstreetmap.org"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-pili-black"
              >
                openstreetmap.org
              </a>{" "}
              e escolha &ldquo;Mostrar endereço&rdquo;. Deixe em branco para
              esconder o mapa.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <Campo id="mapaLat" label="Latitude" register={register} error={errors.mapaLat?.message} />
              <Campo id="mapaLng" label="Longitude" register={register} error={errors.mapaLng?.message} />
              <Campo id="mapaZoom" label="Zoom (1-19)" type="number" register={register} error={errors.mapaZoom?.message} />
            </div>
          </section>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {isDirty && !isPending && (
          <span className="text-sm text-pili-concrete">
            Há alterações não salvas
          </span>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          Salvar configurações
        </Button>
      </div>
    </form>
  );
}

function Campo({
  id,
  label,
  type = "text",
  register,
  error,
}: {
  id: keyof SiteSettingsInput;
  label: string;
  type?: string;
  register: ReturnType<typeof useForm<SiteSettingsInput>>["register"];
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} {...register(id)} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
