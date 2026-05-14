"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { updateLeadStatus, deleteLead } from "@/app/admin/leads/actions";
import { Button } from "@/components/ui/button";
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

const STATUS_OPTIONS: { value: LeadStatus; label: string; color: string }[] = [
  { value: "NOVO", label: "Novo", color: "bg-blue-500" },
  { value: "QUALIFICADO", label: "Qualificado", color: "bg-amber-500" },
  { value: "CONTATADO", label: "Contatado", color: "bg-purple-500" },
  { value: "PROPOSTA", label: "Proposta", color: "bg-cyan-500" },
  { value: "GANHO", label: "Ganho", color: "bg-green-500" },
  { value: "PERDIDO", label: "Perdido", color: "bg-red-500" },
];

interface LeadActionsDropdownProps {
  leadId: string;
}

export function LeadActionsDropdown({ leadId }: LeadActionsDropdownProps) {
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(status: LeadStatus) {
    startTransition(async () => {
      await updateLeadStatus(leadId, status);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteLead(leadId);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-xs" disabled={isPending}>
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Acoes</span>
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
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 size-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
