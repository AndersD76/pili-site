"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/admin/(panel)/produtos/actions";
import { deleteCase } from "@/app/admin/(panel)/obras/actions";
import { deletePost } from "@/app/admin/(panel)/blog/actions";
import { deleteUser } from "@/app/admin/(panel)/usuarios/actions";
import { excluirChamado } from "@/app/admin/(panel)/manutencao/actions";
import { excluirHeroSlide } from "@/app/admin/(panel)/hero/actions";
import { excluirFilial } from "@/app/admin/(panel)/filiais/actions";
import { excluirMarco } from "@/app/admin/(panel)/historia/actions";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

type Entity =
  | "produto"
  | "obra"
  | "artigo"
  | "usuario"
  | "chamado"
  | "slide"
  | "unidade"
  | "marco";

const ACTIONS: Record<
  Entity,
  (id: string) => Promise<{ success: boolean; error?: string | null }>
> = {
  produto: deleteProduct,
  obra: deleteCase,
  artigo: deletePost,
  usuario: deleteUser,
  chamado: excluirChamado,
  slide: excluirHeroSlide,
  unidade: excluirFilial,
  marco: excluirMarco,
};

interface DeleteEntityButtonProps {
  id: string;
  label: string;
  entity: Entity;
  warning: string;
}

export function DeleteEntityButton({
  id,
  label,
  entity,
  warning,
}: DeleteEntityButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        const result = await ACTIONS[entity](id);
        if (result.success) {
          toast.success(
            `${entity[0]!.toUpperCase()}${entity.slice(1)} excluído com sucesso.`,
          );
        } else {
          toast.error(result.error ?? `Erro ao excluir ${entity}.`);
        }
      } catch {
        toast.error(`Não foi possível excluir o ${entity}.`);
      }
    });
  }

  return (
    <ConfirmDialog
      title={`Excluir ${entity}`}
      description={`"${label}" será removido permanentemente. ${warning}`}
      confirmLabel={`Excluir ${entity}`}
      onConfirm={handleDelete}
      trigger={
        <Button
          variant="ghost"
          size="icon-xs"
          disabled={isPending}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Excluir {entity}</span>
        </Button>
      }
    />
  );
}
