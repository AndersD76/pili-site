import { Link } from "@/i18n/routing";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo";
import { ArrowRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "solucoes" });
  return generatePageMetadata({
    locale,
    title: t("title"),
    description: t("metaDesc"),
    path: "/solucoes",
  });
}

/** Rótulo, manchete e descrição de cada setor vêm das traduções. */
const SECTORS = [
  "porto",
  "cooperativa",
  "industria",
  "fertilizante",
  "cimento",
] as const;

export default async function SolucoesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  return (
    <main className="pt-[var(--header-height)]">
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            {t("solucoes.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            {t("solucoes.intro")}
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SECTORS.map((slug) => (
              <Link
                key={slug}
                href={`/solucoes/${slug}`}
                className="group flex flex-col border border-pili-mist p-8 transition-all hover:border-pili-black"
              >
                <span className="font-mono text-xs uppercase tracking-wider text-pili-cement">
                  {slug}
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold uppercase text-pili-black">
                  {t(`forms.applications.${slug}`)}
                </h2>
                <p className="mt-1 text-sm font-medium text-pili-iron">
                  {t(`solucoes.cards.${slug}.headline`)}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-pili-concrete">
                  {t(`solucoes.cards.${slug}.desc`)}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-pili-black transition-colors group-hover:text-pili-safety-deep">
                  {t("common.seeSolution")}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
