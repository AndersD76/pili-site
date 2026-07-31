import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Tombadores Hidráulicos`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Root layout do site público.
 *
 * O `<html>` vive aqui, e não em `app/layout.tsx`, para que `lang` reflita o
 * idioma da rota. Antes o documento não declarava `lang` nenhum — falha WCAG
 * 2.1 nível A (critério 3.1.1) e sinal de idioma ausente para o Google num site
 * que serve três locales. `/admin` e `/portal` têm root layouts próprios.
 */
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={fontVariables}>
      <body className="min-h-screen bg-pili-white text-pili-black font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
