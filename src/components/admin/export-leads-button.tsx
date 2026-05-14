"use client";

import { useTransition } from "react";
import { Download } from "lucide-react";
import { exportLeadsCsv } from "@/app/admin/leads/actions";
import { Button } from "@/components/ui/button";

interface ExportLeadsButtonProps {
  status?: string;
  source?: string;
}

export function ExportLeadsButton({ status, source }: ExportLeadsButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleExport() {
    startTransition(async () => {
      const csv = await exportLeadsCsv({ status, source });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
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
