"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PortalDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[PORTAL_BOUNDARY]", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-lg border border-pili-mist bg-pili-white px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="size-7 text-red-600" />
      </div>
      <h1 className="mt-5 font-display text-xl font-bold text-pili-graphite">
        Algo deu errado
      </h1>
      <p className="mt-2 max-w-md text-sm text-pili-concrete">
        Não foi possível carregar esta página. Tente novamente; se o problema
        persistir, entre em contato com o suporte.
      </p>
      {error.digest && (
        <p className="mt-3 font-mono text-xs text-pili-concrete">
          Código: {error.digest}
        </p>
      )}
      <Button onClick={reset} className="mt-6">
        <RotateCcw className="mr-2 size-4" />
        Tentar novamente
      </Button>
    </div>
  );
}
