"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wrench, Loader2, CheckCircle2 } from "lucide-react";
import { abrirSolicitacao } from "@/app/portal/(dashboard)/equipamentos/[id]/actions";
import {
  solicitacaoSchema,
  type SolicitacaoInput,
} from "@/lib/validators/portal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const TIPOS = [
  { value: "CORRETIVA", label: "Corretiva — equipamento com defeito" },
  { value: "PREVENTIVA", label: "Preventiva — manutenção programada" },
  { value: "INSTALACAO", label: "Instalação ou posta em marcha" },
  { value: "DUVIDA_TECNICA", label: "Dúvida técnica" },
  { value: "OUTRO", label: "Outro" },
] as const;

const URGENCIAS = [
  { value: "PARADA", label: "Equipamento parado" },
  { value: "ALTA", label: "Alta — afeta a operação" },
  { value: "MEDIA", label: "Média" },
  { value: "BAIXA", label: "Baixa" },
] as const;

/**
 * Abertura de chamado de manutenção pelo cliente.
 *
 * O chamado não é a ordem de serviço: a OS é emitida no ERP da PILI. Aqui o
 * cliente registra o pedido e o comercial recebe o ticket.
 */
export function SolicitarManutencao({
  equipmentId,
  nomePadrao,
  telefonePadrao,
}: {
  equipmentId: string;
  nomePadrao: string;
  telefonePadrao: string;
}) {
  const [aberto, setAberto] = useState(false);
  const [numero, setNumero] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SolicitacaoInput>({
    resolver: zodResolver(solicitacaoSchema),
    defaultValues: {
      equipmentId,
      type: "CORRETIVA",
      urgency: "MEDIA",
      description: "",
      contactName: nomePadrao,
      contactPhone: telefonePadrao,
    },
  });

  function onSubmit(values: SolicitacaoInput) {
    setErro(null);
    startTransition(async () => {
      const r = await abrirSolicitacao(values);
      if (r.success) {
        setNumero(r.number ?? null);
        setAberto(false);
        reset({ ...values, description: "" });
      } else {
        setErro(r.error ?? "Erro ao abrir o chamado.");
      }
    });
  }

  if (numero !== null) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <p className="font-display text-base font-bold text-emerald-800">
              Chamado #{numero} aberto
            </p>
            <p className="mt-1 text-sm leading-relaxed text-emerald-700">
              Nossa equipe comercial recebeu a solicitação. Guarde este número
              para acompanhar o atendimento.
            </p>
            <button
              type="button"
              onClick={() => setNumero(null)}
              className="mt-3 text-sm font-medium text-emerald-800 underline underline-offset-2"
            >
              Abrir outro chamado
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!aberto) {
    return (
      <Button
        type="button"
        onClick={() => setAberto(true)}
        className="w-full sm:w-auto"
      >
        <Wrench className="h-4 w-4" />
        Solicitar manutenção
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-lg border border-pili-mist bg-pili-white p-6"
    >
      <div>
        <h3 className="font-display text-lg font-bold text-pili-graphite">
          Solicitar manutenção
        </h3>
        <p className="mt-1 text-sm text-pili-concrete">
          O chamado vai direto para a equipe comercial da PILI.
        </p>
      </div>

      {erro && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {erro}
        </p>
      )}

      <input type="hidden" {...register("equipmentId")} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="type">Tipo de atendimento</Label>
          <select
            id="type"
            {...register("type")}
            className="flex h-10 w-full border border-pili-mist bg-pili-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety"
          >
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="urgency">Urgência</Label>
          <select
            id="urgency"
            {...register("urgency")}
            className="flex h-10 w-full border border-pili-mist bg-pili-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety"
          >
            {URGENCIAS.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">O que está acontecendo</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Descreva o sintoma, quando começou e se há ruído, vazamento ou alarme no painel."
          className="min-h-28"
        />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="contactName">Contato no local</Label>
          <Input id="contactName" {...register("contactName")} />
          {errors.contactName && (
            <p className="text-xs text-red-600">{errors.contactName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contactPhone">Telefone do contato</Label>
          <Input id="contactPhone" type="tel" {...register("contactPhone")} />
          {errors.contactPhone && (
            <p className="text-xs text-red-600">
              {errors.contactPhone.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setAberto(false)}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Abrir chamado
        </Button>
      </div>
    </form>
  );
}
