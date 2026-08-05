"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, MailWarning, Phone, User } from "lucide-react";
import { atualizarChamado } from "@/app/admin/(panel)/manutencao/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const STATUS = [
  { value: "ABERTA", label: "Aberto" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "CONCLUIDA", label: "Concluído" },
  { value: "CANCELADA", label: "Cancelado" },
] as const;

const TIPOS: Record<string, string> = {
  CORRETIVA: "Corretiva",
  PREVENTIVA: "Preventiva",
  INSTALACAO: "Instalação",
  DUVIDA_TECNICA: "Dúvida técnica",
  OUTRO: "Outro",
};

const URGENCIA_PADRAO = { label: "Baixa", cor: "bg-gray-100 text-gray-600" };

const URGENCIAS: Record<string, { label: string; cor: string }> = {
  PARADA: { label: "Equipamento parado", cor: "bg-red-50 text-red-700" },
  ALTA: { label: "Alta", cor: "bg-orange-50 text-orange-700" },
  MEDIA: { label: "Média", cor: "bg-amber-50 text-amber-700" },
  BAIXA: URGENCIA_PADRAO,
};

interface ChamadoCardProps {
  id: string;
  number: number;
  type: string;
  urgency: string;
  status: string;
  description: string;
  contactName: string;
  contactPhone: string;
  internalNote: string | null;
  notificado: boolean;
  abertoEm: string;
  equipamento: string;
  serie: string;
  local: string | null;
  cliente: string;
  clienteEmail: string;
  clienteEmpresa: string | null;
}

export function ChamadoCard(props: ChamadoCardProps) {
  const [status, setStatus] = useState(props.status);
  const [nota, setNota] = useState(props.internalNote ?? "");
  const [isPending, startTransition] = useTransition();

  const urgencia = URGENCIAS[props.urgency] ?? URGENCIA_PADRAO;
  const alterado =
    status !== props.status || nota !== (props.internalNote ?? "");

  function salvar() {
    startTransition(async () => {
      const r = await atualizarChamado({ id: props.id, status, internalNote: nota });
      if (r.success) {
        toast.success(`Chamado #${props.number} atualizado.`);
      } else {
        toast.error(r.error ?? "Erro ao atualizar.");
      }
    });
  }

  return (
    <div className="rounded-lg border border-pili-mist bg-pili-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-lg font-bold text-pili-black">
              #{props.number}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${urgencia.cor}`}
            >
              {urgencia.label}
            </span>
            <span className="text-xs uppercase tracking-wide text-pili-concrete">
              {TIPOS[props.type] ?? props.type}
            </span>
          </div>
          <p className="mt-1 text-sm text-pili-concrete">
            {props.equipamento} ·{" "}
            <span className="font-mono">{props.serie}</span>
          </p>
        </div>

        <span className="font-mono text-xs text-pili-cement">
          {props.abertoEm}
        </span>
      </div>

      {!props.notificado && (
        <p className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
          <MailWarning className="mt-0.5 size-4 shrink-0" />
          Aviso por e-mail não enviado — nenhum transporte configurado. O
          chamado está registrado aqui e o envio pode ser feito em lote quando o
          e-mail for habilitado.
        </p>
      )}

      <p className="mt-4 leading-relaxed text-pili-graphite">
        {props.description}
      </p>

      <div className="mt-4 grid gap-3 border-t border-pili-mist pt-4 text-sm sm:grid-cols-2">
        <div className="flex items-start gap-2 text-pili-concrete">
          <Phone className="mt-0.5 size-4 shrink-0" />
          <span>
            {props.contactName} — {props.contactPhone}
          </span>
        </div>
        <div className="flex items-start gap-2 text-pili-concrete">
          <User className="mt-0.5 size-4 shrink-0" />
          <span>
            {props.cliente}
            {props.clienteEmpresa ? ` — ${props.clienteEmpresa}` : ""}
            <br />
            <a
              href={`mailto:${props.clienteEmail}`}
              className="underline underline-offset-2 hover:text-pili-black"
            >
              {props.clienteEmail}
            </a>
          </span>
        </div>
        {props.local && (
          <p className="text-pili-concrete sm:col-span-2">
            Local: {props.local}
          </p>
        )}
      </div>

      <div className="mt-5 space-y-3 border-t border-pili-mist pt-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label htmlFor={`status-${props.id}`}>Situação</Label>
            <select
              id={`status-${props.id}`}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex h-10 w-56 border border-pili-mist bg-pili-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety"
            >
              {STATUS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="button"
            onClick={salvar}
            disabled={isPending || !alterado}
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Salvar
          </Button>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`nota-${props.id}`}>
            Anotação interna (não aparece para o cliente)
          </Label>
          <Textarea
            id={`nota-${props.id}`}
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Número da OS no ERP, técnico designado, data da visita..."
            className="min-h-20"
          />
        </div>
      </div>
    </div>
  );
}
