"use client";

import { useTransition } from "react";
import { updateLeadStatus } from "@/app/admin/leads/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LeadStatus } from "@prisma/client";

const STATUS_OPTIONS: { value: LeadStatus; label: string; color: string }[] = [
  { value: "NOVO", label: "Novo", color: "bg-blue-500" },
  { value: "QUALIFICADO", label: "Qualificado", color: "bg-amber-500" },
  { value: "CONTATADO", label: "Contatado", color: "bg-purple-500" },
  { value: "PROPOSTA", label: "Proposta", color: "bg-cyan-500" },
  { value: "GANHO", label: "Ganho", color: "bg-green-500" },
  { value: "PERDIDO", label: "Perdido", color: "bg-red-500" },
];

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
      await updateLeadStatus(leadId, value as LeadStatus);
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
