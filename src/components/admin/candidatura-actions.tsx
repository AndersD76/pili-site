"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Download, Check, Undo2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  toggleRevisada,
  excluirCandidatura,
} from "@/app/admin/(panel)/candidaturas/actions";

export function CandidaturaActions({
  id,
  nome,
  temCv,
  revisada,
}: {
  id: string;
  nome: string;
  temCv: boolean;
  revisada: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function marcar() {
    startTransition(async () => {
      const r = await toggleRevisada(id, !revisada);
      if (r.success) {
        toast.success(
          revisada ? "Voltou para pendente." : "Marcada como analisada.",
        );
      } else {
        toast.error(r.error ?? "Erro ao atualizar.");
      }
    });
  }

  function excluir() {
    startTransition(async () => {
      const r = await excluirCandidatura(id);
      if (r.success) {
        toast.success("Candidatura excluída e currículo apagado.");
      } else {
        toast.error(r.error ?? "Erro ao excluir.");
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {temCv && (
        <Button variant="ghost" size="icon" asChild title="Baixar currículo">
          <a href={`/api/candidaturas/${id}/cv`} download>
            <Download className="size-4" />
            <span className="sr-only">Baixar currículo</span>
          </a>
        </Button>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={marcar}
        disabled={isPending}
        title={revisada ? "Marcar como pendente" : "Marcar como analisada"}
      >
        {revisada ? <Undo2 className="size-4" /> : <Check className="size-4" />}
        <span className="sr-only">
          {revisada ? "Marcar como pendente" : "Marcar como analisada"}
        </span>
      </Button>

      <ConfirmDialog
        trigger={
          <Button
            variant="ghost"
            size="icon"
            disabled={isPending}
            title="Excluir"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Excluir</span>
          </Button>
        }
        title="Excluir candidatura"
        description={`A candidatura de ${nome} sai da lista e o currículo é apagado do banco. Não há como desfazer.`}
        confirmLabel="Excluir"
        onConfirm={excluir}
      />
    </div>
  );
}
