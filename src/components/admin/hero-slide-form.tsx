"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import {
  criarHeroSlide,
  atualizarHeroSlide,
  excluirHeroSlide,
} from "@/app/admin/(panel)/hero/actions";
import { heroSlideSchema, type HeroSlideInput } from "@/lib/validators/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const SLIDE_VAZIO: HeroSlideInput = {
  tituloPt: "",
  subtituloPt: "",
  tituloEs: "",
  subtituloEs: "",
  ordem: 0,
  ativo: true,
};

/**
 * Títulos e ordem do slide. A imagem é enviada logo abaixo, pelo
 * `MediaUploader`, e só depois que o slide existe — por isso a criação leva
 * direto para a tela de edição.
 */
export function HeroSlideForm({
  id,
  initial,
}: {
  id?: string;
  initial: HeroSlideInput;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [excluindo, setExcluindo] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<HeroSlideInput>({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: initial,
  });

  function onSubmit(values: HeroSlideInput) {
    startTransition(async () => {
      try {
        const result = id
          ? await atualizarHeroSlide(id, values)
          : await criarHeroSlide(values);

        if (result.success) {
          if (id) {
            toast.success("Slide salvo.");
            router.refresh();
          } else {
            toast.success("Slide criado. Agora envie a imagem de fundo.");
            router.push(`/admin/hero/${result.id}`);
          }
        } else {
          toast.error(result.error ?? "Erro ao salvar.");
        }
      } catch {
        toast.error("Não foi possível salvar o slide.");
      }
    });
  }

  function onExcluir() {
    if (!id) return;
    if (!confirm("Excluir este slide? A imagem enviada some junto.")) return;

    setExcluindo(true);
    startTransition(async () => {
      try {
        const result = await excluirHeroSlide(id);
        if (result.success) {
          toast.success("Slide excluído.");
          router.push("/admin/hero");
          router.refresh();
        } else {
          toast.error(result.error ?? "Erro ao excluir.");
          setExcluindo(false);
        }
      } catch {
        toast.error("Não foi possível excluir o slide.");
        setExcluindo(false);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <section className="rounded-lg border border-pili-mist bg-white p-6">
        <h2 className="mb-1 font-display text-lg font-bold text-pili-black">
          Português
        </h2>
        <p className="mb-5 text-sm text-pili-concrete">
          Serve de base para os demais idiomas: um slide sem tradução em
          espanhol aparece com este texto, em vez de sumir do carrossel.
        </p>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tituloPt">Título</Label>
            <Input
              id="tituloPt"
              placeholder="Descarga que sustenta o agro brasileiro"
              {...register("tituloPt")}
            />
            {errors.tituloPt && (
              <p className="text-xs text-red-600">{errors.tituloPt.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subtituloPt">Subtítulo (opcional)</Label>
            <Input
              id="subtituloPt"
              placeholder="Plataformas hidráulicas de 9 a 30 metros"
              {...register("subtituloPt")}
            />
            {errors.subtituloPt && (
              <p className="text-xs text-red-600">
                {errors.subtituloPt.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-pili-mist bg-white p-6">
        <h2 className="mb-1 font-display text-lg font-bold text-pili-black">
          Espanhol
        </h2>
        <p className="mb-5 text-sm text-pili-concrete">
          Deixe em branco para exibir o texto em português também no site em
          espanhol.
        </p>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tituloEs">Título</Label>
            <Input id="tituloEs" {...register("tituloEs")} />
            {errors.tituloEs && (
              <p className="text-xs text-red-600">{errors.tituloEs.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subtituloEs">Subtítulo (opcional)</Label>
            <Input id="subtituloEs" {...register("subtituloEs")} />
            {errors.subtituloEs && (
              <p className="text-xs text-red-600">
                {errors.subtituloEs.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-pili-mist bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="ordem">Ordem no carrossel</Label>
            <Input id="ordem" type="number" min={0} {...register("ordem")} />
            {errors.ordem && (
              <p className="text-xs text-red-600">{errors.ordem.message}</p>
            )}
          </div>
        </div>

        <Separator className="my-5" />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            {...register("ativo")}
            className="size-4 rounded border-pili-mist accent-pili-steel"
          />
          Exibir este slide na home
        </label>
      </section>

      <div className="flex items-center justify-between gap-3">
        {id ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onExcluir}
            disabled={isPending}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            {excluindo ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 size-4" />
            )}
            Excluir slide
          </Button>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-3">
          {isDirty && !isPending && (
            <span className="text-sm text-pili-concrete">
              Há alterações não salvas
            </span>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending && !excluindo && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            {id ? "Salvar slide" : "Criar e enviar imagem"}
          </Button>
        </div>
      </div>
    </form>
  );
}
