"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { LOCALES } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Bandeira e rótulo por idioma.
 *
 * O emoji de bandeira é uma sequência de Regional Indicator Symbols — renderiza
 * nativamente em macOS, iOS, Android e Linux. No Windows o sistema não tem os
 * glifos e cai para as duas letras do país ("BR", "ES"), o que continua legível;
 * por isso o rótulo textual acompanha a bandeira em vez de substituí-la.
 */
const LOCALE_INFO: Record<string, { flag: string; label: string; name: string }> = {
  "pt-BR": { flag: "🇧🇷", label: "PT", name: "Português" },
  es: { flag: "🇪🇸", label: "ES", name: "Español" },
};

export function LanguageSwitcher() {
  const t = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1">
      {LOCALES.map((l) => {
        const info = LOCALE_INFO[l];
        if (!info) return null;

        const ativo = locale === l;

        return (
          <button
            key={l}
            type="button"
            onClick={() => switchLocale(l)}
            aria-label={t("switchLanguage", { name: info.name })}
            aria-current={ativo ? "true" : undefined}
            className={cn(
              "flex items-center gap-1.5 rounded px-2 py-1 transition-colors",
              ativo
                ? "bg-pili-white/10 text-pili-white"
                : "text-pili-cement hover:bg-pili-white/5 hover:text-pili-white",
            )}
          >
            <span aria-hidden="true" className="text-base leading-none">
              {info.flag}
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
              {info.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
