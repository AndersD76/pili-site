"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("cookies");
  const consent = useCookieConsent();

  if (consent !== "none") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-pili-iron bg-pili-graphite p-4 sm:p-6">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-pili-mist">
          {t("text")}{" "}
          <Link
            href="/politica-privacidade"
            className="underline underline-offset-2 hover:text-pili-white"
          >
            {t("policyLink")}
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => setConsent("rejected")}
            className="border border-pili-iron px-4 py-2 text-xs font-medium uppercase tracking-wider text-pili-mist transition-colors hover:bg-pili-steel"
          >
            {t("reject")}
          </button>
          <button
            onClick={() => setConsent("accepted")}
            className="bg-pili-safety px-4 py-2 text-xs font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
