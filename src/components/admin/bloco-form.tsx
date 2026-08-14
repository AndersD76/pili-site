"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  atualizarBloco,
  blocoSchema,
  type BlocoInput,
} from "@/app/admin/(panel)/historia/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/** Texto que o site exibe hoje, mostrado como placeholder. */
export interface PadraoBloco {
  titulo: string;
  subtitulo: string;
  texto: string;
}

/**
 * Textos de um bloco de seção.
 *
 * Todos os campos são opcionais: apagar um campo devolve o site ao texto
 * padrão, então a edição é reversível sem precisar lembrar do valor original.
 */
export function BlocoForm({
  chave,
  initial,
  padrao,
}: {
  chave: string;
  initial: BlocoInput;
  padrao: PadraoBloco;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<BlocoInput>({
    resolver: zodResolver(blocoSchema),
    defaultValues: initial,
  });

  function onSubmit(values: BlocoInput) {
    startTransition(async () => {
      try {
        const r = await atualizarBloco(chave, values);
        if (r.success) {
          toast.success("Bloco salvo.");
          router.refresh();
        } else {
          toast.error(r.error ?? "Erro ao salvar.");
        }
      } catch {
        toast.error("Não foi possível salvar o bloco.");
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
          Campo vazio devolve o site ao texto padrão, mostrado em cinza.
        </p>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="subtituloPt">Etiqueta acima do título</Label>
            <Input
              id="subtituloPt"
              placeholder={padrao.subtitulo}
              {...register("subtituloPt")}
            />
            {errors.subtituloPt && (
              <p className="text-xs text-red-600">
                {errors.subtituloPt.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tituloPt">Título</Label>
            <Input
              id="tituloPt"
              placeholder={padrao.titulo}
              {...register("tituloPt")}
            />
            {errors.tituloPt && (
              <p className="text-xs text-red-600">{errors.tituloPt.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="textoPt">Texto de apresentação</Label>
            <Textarea
              id="textoPt"
              rows={4}
              placeholder={padrao.texto}
              {...register("textoPt")}
            />
            {errors.textoPt && (
              <p className="text-xs text-red-600">{errors.textoPt.message}</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-pili-mist bg-white p-6">
        <h2 className="mb-1 font-display text-lg font-bold text-pili-black">
          Espanhol
        </h2>
        <p className="mb-5 text-sm text-pili-concrete">
          Em branco, o site em espanhol usa a tradução padrão.
        </p>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="subtituloEs">Etiqueta acima do título</Label>
            <Input id="subtituloEs" {...register("subtituloEs")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tituloEs">Título</Label>
            <Input id="tituloEs" {...register("tituloEs")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="textoEs">Texto de apresentação</Label>
            <Textarea id="textoEs" rows={4} {...register("textoEs")} />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        {isDirty && !isPending && (
          <span className="text-sm text-pili-concrete">
            Há alterações não salvas
          </span>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          Salvar textos
        </Button>
      </div>
    </form>
  );
}
