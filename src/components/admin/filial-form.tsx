"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, MapPin, Trash2 } from "lucide-react";
import {
  criarFilial,
  atualizarFilial,
  excluirFilial,
} from "@/app/admin/(panel)/filiais/actions";
import { filialSchema, type FilialInput } from "@/lib/validators/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

const TIPOS = [
  { value: "FILIAL", label: "Filial" },
  { value: "ESCRITORIO", label: "Escritório comercial" },
  { value: "ASSISTENCIA", label: "Assistência técnica" },
] as const;

export const FILIAL_VAZIA: FilialInput = {
  nome: "",
  tipo: "FILIAL",
  cidade: "",
  uf: "",
  endereco: "",
  cep: "",
  telefone: "",
  lat: "",
  lng: "",
  ordem: 0,
  ativa: true,
};

/**
 * Cadastro de unidade.
 *
 * Serve para criar e editar: `id` ausente significa criação. As coordenadas são
 * opcionais — sem elas a unidade aparece no rodapé como endereço, só não entra
 * no mapa.
 */
export function FilialForm({
  id,
  initial,
}: {
  id?: string;
  initial: FilialInput;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [excluindo, setExcluindo] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FilialInput>({
    resolver: zodResolver(filialSchema),
    defaultValues: initial,
  });

  function onSubmit(values: FilialInput) {
    startTransition(async () => {
      try {
        const result = id
          ? await atualizarFilial(id, values)
          : await criarFilial(values);

        if (result.success) {
          toast.success(id ? "Unidade salva." : "Unidade criada.");
          router.push("/admin/filiais");
          router.refresh();
        } else {
          toast.error(result.error ?? "Erro ao salvar.");
        }
      } catch {
        toast.error("Não foi possível salvar a unidade.");
      }
    });
  }

  function onExcluir() {
    if (!id) return;
    setExcluindo(true);
    startTransition(async () => {
      try {
        const result = await excluirFilial(id);
        if (result.success) {
          toast.success("Unidade excluída.");
          router.push("/admin/filiais");
          router.refresh();
        } else {
          toast.error(result.error ?? "Erro ao excluir.");
          setExcluindo(false);
        }
      } catch {
        toast.error("Não foi possível excluir a unidade.");
        setExcluindo(false);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      <section className="rounded-lg border border-pili-mist bg-white p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-pili-black">
          Identificação
        </h2>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nome">Nome exibido no site</Label>
            <Input id="nome" placeholder="Filial Minas Gerais" {...register("nome")} />
            {errors.nome && (
              <p className="text-xs text-red-600">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tipo">Tipo de unidade</Label>
            <select
              id="tipo"
              {...register("tipo")}
              className="flex h-10 w-full border border-pili-mist bg-pili-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety"
            >
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.tipo && (
              <p className="text-xs text-red-600">{errors.tipo.message}</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-pili-mist bg-white p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-pili-black">
          Endereço
        </h2>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="endereco">Logradouro, número e bairro</Label>
            <Input
              id="endereco"
              placeholder="Av. Exemplo, 1000 — Centro"
              {...register("endereco")}
            />
            {errors.endereco && (
              <p className="text-xs text-red-600">{errors.endereco.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_5rem_9rem]">
            <div className="space-y-1.5">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" {...register("cidade")} />
              {errors.cidade && (
                <p className="text-xs text-red-600">{errors.cidade.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="uf">UF</Label>
              <Input id="uf" maxLength={2} placeholder="MG" {...register("uf")} />
              {errors.uf && (
                <p className="text-xs text-red-600">{errors.uf.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cep">CEP</Label>
              <Input id="cep" placeholder="00000-000" {...register("cep")} />
              {errors.cep && (
                <p className="text-xs text-red-600">{errors.cep.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="telefone">Telefone da unidade (opcional)</Label>
            <Input
              id="telefone"
              placeholder="+55 00 0000-0000"
              {...register("telefone")}
            />
            {errors.telefone && (
              <p className="text-xs text-red-600">{errors.telefone.message}</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-pili-mist bg-white p-6">
        <div className="mb-3 flex items-center gap-3">
          <MapPin className="h-5 w-5 text-pili-safety" />
          <h2 className="font-display text-lg font-bold text-pili-black">
            Ponto no mapa
          </h2>
        </div>
        <p className="mb-5 text-sm text-pili-concrete">
          Para achar as coordenadas, clique com o botão direito no ponto em{" "}
          <a
            href="https://www.openstreetmap.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-pili-black"
          >
            openstreetmap.org
          </a>{" "}
          e escolha &ldquo;Mostrar endereço&rdquo;. Deixando em branco, a unidade
          aparece no rodapé como endereço, mas não recebe marcador no mapa.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="lat">Latitude</Label>
            <Input id="lat" placeholder="-19.9167" {...register("lat")} />
            {errors.lat && (
              <p className="text-xs text-red-600">{errors.lat.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lng">Longitude</Label>
            <Input id="lng" placeholder="-43.9345" {...register("lng")} />
            {errors.lng && (
              <p className="text-xs text-red-600">{errors.lng.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ordem">Ordem de exibição</Label>
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
            {...register("ativa")}
            className="size-4 rounded border-pili-mist accent-pili-steel"
          />
          Exibir esta unidade no site
        </label>
      </section>

      <div className="flex items-center justify-between gap-3">
        {id ? (
          <ConfirmDialog
            title="Excluir unidade"
            description="A unidade será removida permanentemente do site. A ação não pode ser desfeita."
            confirmLabel="Excluir unidade"
            onConfirm={onExcluir}
            trigger={
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                {excluindo ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 size-4" />
                )}
                Excluir unidade
              </Button>
            }
          />
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
            {id ? "Salvar unidade" : "Criar unidade"}
          </Button>
        </div>
      </div>
    </form>
  );
}
