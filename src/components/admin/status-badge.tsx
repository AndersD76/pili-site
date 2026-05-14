import type { LeadStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  NOVO: { label: "Novo", className: "bg-blue-100 text-blue-800" },
  QUALIFICADO: { label: "Qualificado", className: "bg-amber-100 text-amber-800" },
  CONTATADO: { label: "Contatado", className: "bg-purple-100 text-purple-800" },
  PROPOSTA: { label: "Proposta", className: "bg-cyan-100 text-cyan-800" },
  GANHO: { label: "Ganho", className: "bg-green-100 text-green-800" },
  PERDIDO: { label: "Perdido", className: "bg-red-100 text-red-800" },
};

interface StatusBadgeProps {
  status: LeadStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent font-medium",
        config.className
      )}
    >
      {config.label}
    </Badge>
  );
}
