"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Languages, Loader2 } from "lucide-react";
import { traduzirCampos } from "@/app/admin/(panel)/traduzir/actions";
import type { CamposTraduziveis } from "@/lib/traduzir";
import { Button } from "@/components/ui/button";

/**
 * Traduz os campos em português e preenche os campos em espanhol do formulário.
 *
 * O resultado entra no formulário, não no banco: o editor revisa e só então
 * salva. Tradução automática é rascunho, não publicação.
 */
export function BotaoTraduzir({
  origem,
  aoTraduzir,
  habilitado,
}: {
  /** Campos em português, lidos do formulário no momento do clique. */
  origem: () => CamposTraduziveis;
  /** Recebe os campos traduzidos para preencher a seção em espanhol. */
  aoTraduzir: (campos: CamposTraduziveis) => void;
  habilitado: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function traduzir() {
    startTransition(async () => {
      const r = await traduzirCampos(origem());

      if (!r.success) {
        toast.error(r.error);
        return;
      }

      aoTraduzir(r.campos);
      toast.success("Tradução preenchida. Revise antes de salvar.");
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={traduzir}
      disabled={isPending || !habilitado}
      title={
        habilitado
          ? "Traduzir o português para espanhol"
          : "Tradução automática não configurada"
      }
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Languages className="size-4" />
      )}
      {isPending ? "Traduzindo..." : "Traduzir do português"}
    </Button>
  );
}
