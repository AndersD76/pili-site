"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { LOCALES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const LOCALE_LABELS: Record<string, string> = {
  "pt-BR": "PT",
  en: "EN",
  es: "ES",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-0.5">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={cn(
            "px-1.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
            locale === l
              ? "text-pili-safety"
              : "text-pili-cement hover:text-pili-white"
          )}
          aria-label={`Mudar idioma para ${LOCALE_LABELS[l]}`}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
