"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { reenviarPendentes } from "@/app/admin/(panel)/manutencao/actions";
import { Button } from "@/components/ui/button";

/**
 * Reenvia ao Portal Pili os chamados que ficaram pendentes.
 *
 * Fica desabilitado enquanto a integração não estiver configurada — clicar
 * sem endereço de destino só produziria uma falha silenciosa.
 */
export function ReenviarPendentes({ habilitado }: { habilitado: boolean }) {
  const [isPending, startTransition] = useTransition();

  function reenviar() {
    startTransition(async () => {
      const r = await reenviarPendentes();

      if (!r.success) {
        toast.error(r.error ?? "Erro ao reenviar.");
        return;
      }

      if (r.enviados === 0 && r.falharam === 0) {
        toast.info("Nenhum chamado pendente.");
      } else if (r.falharam) {
        toast.warning(
          `${r.enviados} enviado(s), ${r.falharam} ainda com falha. Veja os logs.`,
        );
      } else {
        toast.success(`${r.enviados} chamado(s) entregue(s) ao Portal.`);
      }
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={reenviar}
      disabled={isPending || !habilitado}
      title={
        habilitado
          ? "Reenviar ao Portal Pili"
          : "Integração com o Portal Pili não configurada"
      }
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Send className="size-4" />
      )}
      Reenviar ao Portal
    </Button>
  );
}
