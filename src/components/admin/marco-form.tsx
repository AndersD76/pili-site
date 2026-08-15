"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import {
  criarMarco,
  atualizarMarco,
  excluirMarco,
} from "@/app/admin/(panel)/historia/actions";
import { marcoSchema, type MarcoInput } from "@/lib/validators/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export const MARCO_VAZIO: MarcoInput = {
  ano: "",
  tituloPt: "",
  textoPt: "",
  tituloEs: "",
  textoEs: "",
  ordem: 0,
  ativo: true,
};

export function MarcoForm({
  id,
  initial,
}: {
  id?: string;
  initial: MarcoInput;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [excluindo, setExcluindo] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<MarcoInput>({
    resolver: zodResolver(marcoSchema),
    defaultValues: initial,
  });

  function onSubmit(values: MarcoInput) {
    startTransition(async () => {
      try {
        const r = id ? await atualizarMarco(id, values) : await criarMarco(values);
        if (r.success) {
          toast.success(id ? "Marco salvo." : "Marco criado.");
          router.push("/admin/historia");
          router.refresh();
        } else {
          toast.error(r.error ?? "Erro ao salvar.");
        }
      } catch {
        toast.error("Não foi possível salvar o marco.");
      }
    });
  }

  function onExcluir() {
    if (!id) return;
    if (!confirm("Excluir este marco da linha do tempo?")) return;

    setExcluindo(true);
    startTransition(async () => {
      try {
        const r = await excluirMarco(id);
        if (r.success) {
          toast.success("Marco excluído.");
          router.push("/admin/historia");
          router.refresh();
        } else {
          toast.error(r.error ?? "Erro ao excluir.");
          setExcluindo(false);
        }
      } catch {
        toast.error("Não foi possível excluir o marco.");
        setExcluindo(false);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <section className="rounded-lg border border-pili-mist bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="ano">Ano</Label>
            <Input id="ano" placeholder="1979" {...register("ano")} />
            <p className="text-xs text-pili-concrete">
              Deixe em branco para o marco aparecer como &ldquo;Hoje&rdquo;.
            </p>
            {errors.ano && (
              <p className="text-xs text-red-600">{errors.ano.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ordem">Ordem na linha</Label>
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
          Exibir este marco na página da empresa
        </label>
      </section>

      <section className="rounded-lg border border-pili-mist bg-white p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-pili-black">
          Português
        </h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tituloPt">Título</Label>
            <Input id="tituloPt" placeholder="Fundação" {...register("tituloPt")} />
            {errors.tituloPt && (
              <p className="text-xs text-red-600">{errors.tituloPt.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="textoPt">Texto</Label>
            <Textarea id="textoPt" rows={4} {...register("textoPt")} />
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
          Em branco, o site em espanhol exibe o texto em português.
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
            <Label htmlFor="textoEs">Texto</Label>
            <Textarea id="textoEs" rows={4} {...register("textoEs")} />
            {errors.textoEs && (
              <p className="text-xs text-red-600">{errors.textoEs.message}</p>
            )}
          </div>
        </div>
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
            Excluir marco
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
            {id ? "Salvar marco" : "Criar marco"}
          </Button>
        </div>
      </div>
    </form>
  );
}
