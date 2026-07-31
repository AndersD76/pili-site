"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { exportLeadsCsv } from "@/app/admin/(panel)/leads/actions";
import { Button } from "@/components/ui/button";

interface ExportLeadsButtonProps {
  status?: string;
  source?: string;
}

export function ExportLeadsButton({ status, source }: ExportLeadsButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleExport() {
    startTransition(async () => {
      try {
        const result = await exportLeadsCsv({ status, source });
        if (!result.success || !result.csv) {
          toast.error(result.error ?? "Erro ao exportar leads.");
          return;
        }
        const blob = new Blob([result.csv], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        toast.error("Não foi possível exportar os leads.");
      }
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isPending}
    >
      <Download className="mr-2 size-4" />
      {isPending ? "Exportando..." : "Exportar CSV"}
    </Button>
  );
}
