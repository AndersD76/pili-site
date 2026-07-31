"use client";

import { useSyncExternalStore } from "react";
import { Link } from "@/i18n/routing";

export const CONSENT_KEY = "pili-cookie-consent";
export type ConsentValue = "accepted" | "rejected" | "none" | "unknown";

/** Evento próprio: `storage` do navegador não dispara na aba que gravou. */
const CONSENT_EVENT = "pili:consent-change";

function getConsent(): ConsentValue {
  if (typeof window === "undefined") return "unknown";
  const value = localStorage.getItem(CONSENT_KEY);
  return value === "accepted" || value === "rejected" ? value : "none";
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}

/** Hook público: quem carrega script de terceiro consulta isto antes. */
export function useCookieConsent(): ConsentValue {
  return useSyncExternalStore(subscribe, getConsent, () => "unknown");
}

function setConsent(value: "accepted" | "rejected") {
  localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function CookieBanner() {
  const consent = useCookieConsent();

  if (consent !== "none") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-pili-iron bg-pili-graphite p-4 sm:p-6">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-pili-mist">
          Usamos cookies essenciais para o funcionamento do site. Com sua
          autorização, usamos também cookies de análise para entender como o
          site é usado. Você pode recusar sem perder nenhuma funcionalidade —
          veja a{" "}
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
            onClick={() => setConsent("rejected")}
            className="border border-pili-iron px-4 py-2 text-xs font-medium uppercase tracking-wider text-pili-mist transition-colors hover:bg-pili-steel"
          >
            Recusar
          </button>
          <button
            onClick={() => setConsent("accepted")}
            className="bg-pili-safety px-4 py-2 text-xs font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
