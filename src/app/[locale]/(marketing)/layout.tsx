import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { FloatingWidgets } from "@/components/shared/floating-widgets";
import { CookieBanner } from "@/components/shared/cookie-banner";
import { Analytics } from "@/components/shared/analytics";
import { generateOrganizationJsonLd, jsonLdScript } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";
import { getTranslations } from "next-intl/server";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // O next-intl exige `setRequestLocale` em cada layout e página para permitir
  // renderização estática; sem isto toda rota do site vira dinâmica.
  const { locale } = await params;
  setRequestLocale(locale);

  const settings = await getSiteSettings();
  const t = await getTranslations("common");

  return (
    <>
      {/* Identidade da marca para o Knowledge Panel — emitida uma vez por página. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(generateOrganizationJsonLd()),
        }}
      />
      <a href="#main-content" className="skip-to-content">
        {t("skipToContent")}
      </a>
      <Header piliTechUrl={settings.piliTechUrl} />
      <div id="main-content">{children}</div>
      <Footer />
      <FloatingWidgets whatsapp={settings.whatsapp} />
      <CookieBanner />
      <Analytics />
    </>
  );
}
