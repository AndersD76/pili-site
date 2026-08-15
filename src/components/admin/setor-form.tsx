"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  atualizarSetor,
  setorSchema,
  type SetorInput,
} from "@/app/admin/(panel)/setores/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

/**
 * Textos do cartão de setor.
 *
 * Os campos mostram o texto padrão como placeholder: assim fica claro o que o
 * site exibe hoje e o que muda ao preencher.
 */
export function SetorForm({
  slug,
  initial,
  padraoTitulo,
  padraoDescricao,
  padraoHeadline,
  padraoDescLonga,
}: {
  slug: string;
  initial: SetorInput;
  padraoTitulo: string;
  padraoDescricao: string;
  padraoHeadline: string;
  padraoDescLonga: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SetorInput>({
    resolver: zodResolver(setorSchema),
    defaultValues: initial,
  });

  function onSubmit(values: SetorInput) {
    startTransition(async () => {
      try {
        const result = await atualizarSetor(slug, values);
        if (result.success) {
          toast.success("Setor salvo.");
          router.refresh();
        } else {
          toast.error(result.error ?? "Erro ao salvar.");
        }
      } catch {
        toast.error("Não foi possível salvar o setor.");
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
          Em branco, o site usa o texto padrão mostrado em cinza no campo.
        </p>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tituloPt">Título do cartão</Label>
            <Input
              id="tituloPt"
              placeholder={padraoTitulo}
              {...register("tituloPt")}
            />
            {errors.tituloPt && (
              <p className="text-xs text-red-600">{errors.tituloPt.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="descricaoPt">Descrição</Label>
            <Input
              id="descricaoPt"
              placeholder={padraoDescricao}
              {...register("descricaoPt")}
            />
            {errors.descricaoPt && (
              <p className="text-xs text-red-600">
                {errors.descricaoPt.message}
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
          Em branco, o site em espanhol usa a tradução padrão das mensagens.
        </p>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tituloEs">Título do cartão</Label>
            <Input id="tituloEs" {...register("tituloEs")} />
            {errors.tituloEs && (
              <p className="text-xs text-red-600">{errors.tituloEs.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="descricaoEs">Descrição</Label>
            <Input id="descricaoEs" {...register("descricaoEs")} />
            {errors.descricaoEs && (
              <p className="text-xs text-red-600">
                {errors.descricaoEs.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-pili-mist bg-white p-6">
        <h2 className="mb-1 font-display text-lg font-bold text-pili-black">
          Página do setor
        </h2>
        <p className="mb-5 text-sm text-pili-concrete">
          Textos exibidos em /solucoes/{slug}, independentes do card da home.
        </p>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="headlinePt">Chamada (português)</Label>
            <Input
              id="headlinePt"
              placeholder={padraoHeadline}
              {...register("headlinePt")}
            />
            {errors.headlinePt && (
              <p className="text-xs text-red-600">{errors.headlinePt.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="descricaoLongaPt">Descrição (português)</Label>
            <Textarea
              id="descricaoLongaPt"
              rows={3}
              placeholder={padraoDescLonga}
              {...register("descricaoLongaPt")}
            />
            {errors.descricaoLongaPt && (
              <p className="text-xs text-red-600">
                {errors.descricaoLongaPt.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="headlineEs">Chamada (espanhol)</Label>
            <Input id="headlineEs" {...register("headlineEs")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="descricaoLongaEs">Descrição (espanhol)</Label>
            <Textarea
              id="descricaoLongaEs"
              rows={3}
              {...register("descricaoLongaEs")}
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-pili-mist bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="ordem">Ordem na home</Label>
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
          Exibir este setor na home
        </label>
        <p className="mt-2 text-xs text-pili-concrete">
          Desmarcar tira o cartão da home. A página /solucoes/{slug} continua no
          ar.
        </p>
      </section>

      <div className="flex items-center justify-end gap-3">
        {isDirty && !isPending && (
          <span className="text-sm text-pili-concrete">
            Há alterações não salvas
          </span>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          Salvar setor
        </Button>
      </div>
    </form>
  );
}
