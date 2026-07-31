import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/constants";

export const routing = defineRouting({
  // Fonte única: `LOCALES`/`DEFAULT_LOCALE` existiam em `constants.ts` e a lista
  // estava reescrita à mão aqui.
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
