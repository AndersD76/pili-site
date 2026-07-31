"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { updateLeadStatus, deleteLead } from "@/app/admin/(panel)/leads/actions";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LeadStatus } from "@prisma/client";
import { STATUS_OPTIONS } from "@/lib/lead-display";

interface LeadActionsDropdownProps {
  leadId: string;
  leadName: string;
}

export function LeadActionsDropdown({
  leadId,
  leadName,
}: LeadActionsDropdownProps) {
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(status: LeadStatus) {
    startTransition(async () => {
      try {
        const result = await updateLeadStatus(leadId, status);
        if (result.success) {
          toast.success("Status atualizado.");
        } else {
          toast.error(result.error ?? "Erro ao atualizar status.");
        }
      } catch {
        toast.error("Não foi possível atualizar o status.");
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      try {
        const result = await deleteLead(leadId);
        if (result.success) {
          toast.success("Lead excluído.");
        } else {
          toast.error(result.error ?? "Erro ao excluir lead.");
        }
      } catch {
        toast.error("Não foi possível excluir o lead.");
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-xs" disabled={isPending}>
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/leads/${leadId}`}>
            <Eye className="mr-2 size-4" />
            Ver detalhes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Alterar status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {STATUS_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => handleStatusChange(opt.value)}
              >
                <span
                  className={`mr-2 inline-block size-2 rounded-full ${opt.color}`}
                />
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <ConfirmDialog
          title="Excluir lead"
          description={`O lead "${leadName}" sairá da listagem e dos relatórios. O registro é preservado no banco e pode ser recuperado pela equipe técnica.`}
          confirmLabel="Excluir lead"
          onConfirm={handleDelete}
          trigger={
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => e.preventDefault()}
            >
              <Trash2 className="mr-2 size-4" />
              Excluir
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
