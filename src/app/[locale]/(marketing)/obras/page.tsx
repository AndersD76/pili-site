import { getObras } from "@/lib/content";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { CaseCard } from "@/components/marketing/case-card";
import { Link } from "@/i18n/routing";
import { generatePageMetadata } from "@/lib/seo";

/**
 * O conteúdo vem do banco e muda pelo painel. Com ISR a página é servida do
 * cache e revalidada em segundo plano — as edições aparecem sem redeploy, e a
 * primeira visita não paga a consulta.
 */
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "obras" });
  return generatePageMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDesc"),
    path: "/obras",
  });
}

export default async function ObrasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  const CASES = await getObras();

  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            {t("nav.projects")}
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            {t("obras.intro")}
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/orcamento"
              className="bg-pili-safety px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
            >
              {t("common.requestQuote")}
            </Link>
            <Link
              href="/produtos"
              className="border border-pili-iron px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-pili-mist transition-colors hover:bg-pili-steel"
            >
              {t("hero.cta_secondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* Cases grid */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CASES.map((c) => (
              <CaseCard
                key={c.slug}
                title={c.title}
                slug={c.slug}
                client={c.client}
                location={c.location}
                year={c.year}
                application={c.application}
                metrics={c.metrics}
                image={c.image}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
