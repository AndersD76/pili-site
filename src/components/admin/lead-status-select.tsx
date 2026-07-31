"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateLeadStatus } from "@/app/admin/(panel)/leads/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LeadStatus } from "@prisma/client";
import { STATUS_OPTIONS } from "@/lib/lead-display";

interface LeadStatusSelectProps {
  leadId: string;
  currentStatus: string;
}

export function LeadStatusSelect({
  leadId,
  currentStatus,
}: LeadStatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    startTransition(async () => {
      try {
        const result = await updateLeadStatus(leadId, value as LeadStatus);
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

  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            <span className="flex items-center gap-2">
              <span
                className={`inline-block size-2 rounded-full ${opt.color}`}
              />
              {opt.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
