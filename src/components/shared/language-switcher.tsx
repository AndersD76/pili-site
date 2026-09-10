"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { LOCALES } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Bandeiras em SVG, não em emoji.
 *
 * O emoji de bandeira é uma sequência de Regional Indicator Symbols e o Windows
 * não tem os glifos: no lugar da bandeira saíam as duas letras do país, que
 * ainda apareciam coladas no rótulo ("ES ES"). Desenhadas aqui, as bandeiras
 * aparecem igual em qualquer sistema.
 */
function BandeiraBrasil() {
  return (
    <svg viewBox="0 0 28 20" className="h-3.5 w-5" aria-hidden="true">
      <rect width="28" height="20" rx="2" fill="#009B3A" />
      <path d="M14 3.2 25.2 10 14 16.8 2.8 10Z" fill="#FEDF00" />
      <circle cx="14" cy="10" r="4.1" fill="#002776" />
    </svg>
  );
}

function BandeiraEspanha() {
  return (
    <svg viewBox="0 0 28 20" className="h-3.5 w-5" aria-hidden="true">
      <rect width="28" height="20" rx="2" fill="#C60B1E" />
      <rect y="5" width="28" height="10" fill="#FFC400" />
    </svg>
  );
}

const LOCALE_INFO: Record<
  string,
  { bandeira: ReactNode; label: string; name: string }
> = {
  "pt-BR": { bandeira: <BandeiraBrasil />, label: "PT", name: "Português" },
  es: { bandeira: <BandeiraEspanha />, label: "ES", name: "Español" },
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
            <span className="flex items-center leading-none">
              {info.bandeira}
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
