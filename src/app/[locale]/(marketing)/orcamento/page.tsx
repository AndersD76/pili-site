import { generatePageMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { LeadForm } from "@/components/marketing/lead-form";
import { getSiteSettings } from "@/lib/site-settings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "orcamento" });
  return generatePageMetadata({
    locale,
    title: t("title"),
    description: t("metaDesc"),
    path: "/orcamento",
  });
}

export default async function OrcamentoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const settings = await getSiteSettings();

  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            {t("orcamento.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            {t("orcamento.intro")}
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="border border-pili-mist p-8 lg:p-12">
            <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              {t("orcamento.projectData")}
            </h2>
            <p className="mt-3 text-sm text-pili-concrete">
              {t("orcamento.projectDataText")}
            </p>
            <div className="mt-8">
              <LeadForm compact={false} source="ORCAMENTO" />
            </div>
          </div>
        </div>
      </section>

      {/* Additional info */}
      <section className="bg-pili-paper py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-xl font-bold uppercase text-pili-black">
            {t("orcamento.otherChannel")}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}?text=${t("orcamento.whatsappMessage")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-pili-mist bg-pili-white p-6 transition-all hover:border-pili-black"
            >
              <span className="font-display text-sm font-bold uppercase text-pili-black">
                WhatsApp
              </span>
              <p className="mt-2 font-mono text-xs text-pili-concrete">
                {settings.whatsapp}
              </p>
            </a>
            <a
              href={`mailto:${settings.emailComercial}?subject=${t("orcamento.emailSubject")}`}
              className="border border-pili-mist bg-pili-white p-6 transition-all hover:border-pili-black"
            >
              <span className="font-display text-sm font-bold uppercase text-pili-black">
                {t("contato.commercialEmail")}
              </span>
              <p className="mt-2 font-mono text-xs text-pili-concrete">
                {settings.emailComercial}
              </p>
            </a>
            <a
              href={`tel:${settings.telefone.replace(/\s/g, "")}`}
              className="border border-pili-mist bg-pili-white p-6 transition-all hover:border-pili-black"
            >
              <span className="font-display text-sm font-bold uppercase text-pili-black">
                {t("contato.phone")}
              </span>
              <p className="mt-2 font-mono text-xs text-pili-concrete">
                {settings.telefone}
              </p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
