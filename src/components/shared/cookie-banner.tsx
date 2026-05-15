"use client";

import { useSyncExternalStore } from "react";
import { Link } from "@/i18n/routing";

function getConsent() {
  if (typeof window === "undefined") return "unknown";
  return localStorage.getItem("pili-cookie-consent") ?? "none";
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function CookieBanner() {
  const consent = useSyncExternalStore(subscribe, getConsent, () => "unknown");

  if (consent !== "none") return null;

  function accept() {
    localStorage.setItem("pili-cookie-consent", "accepted");
    window.dispatchEvent(new Event("storage"));
  }

  function reject() {
    localStorage.setItem("pili-cookie-consent", "rejected");
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-pili-iron bg-pili-graphite p-4 sm:p-6">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-pili-mist">
          Utilizamos cookies para melhorar sua experiência. Ao continuar
          navegando, você concorda com nossa{" "}
          <Link
            href="/politica-privacidade"
            className="underline underline-offset-2 hover:text-pili-white"
          >
            política de privacidade
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={reject}
            className="border border-pili-iron px-4 py-2 text-xs font-medium uppercase tracking-wider text-pili-mist transition-colors hover:bg-pili-steel"
          >
            Recusar
          </button>
          <button
            onClick={accept}
            className="bg-pili-safety px-4 py-2 text-xs font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
