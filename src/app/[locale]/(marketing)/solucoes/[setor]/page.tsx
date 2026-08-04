import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Link } from "@/i18n/routing";
import { getProdutos, getObras } from "@/lib/content";
import { ProductCard } from "@/components/marketing/product-card";
import { LeadForm } from "@/components/marketing/lead-form";
import {
  generatePageMetadata,
  generateBreadcrumbJsonLd, jsonLdScript} from "@/lib/seo";

/**
 * O conteúdo vem do banco e muda pelo painel. Com ISR a página é servida do
 * cache e revalidada em segundo plano — as edições aparecem sem redeploy, e a
 * primeira visita não paga a consulta.
 */
export const revalidate = 300;

/* -------------------------------------------------------------------------- */
/*  Sector data                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Só os slugs. Rótulo, manchete, descrição, problema e solução vêm de
 * `solucoes.setores.*` — o bloco inteiro estava duplicado em português aqui e
 * na listagem, e nenhuma das duas cópias tinha tradução.
 */
const SECTORS = [
  "porto",
  "cooperativa",
  "industria",
  "fertilizante",
  "cimento",
] as const;

type Setor = (typeof SECTORS)[number];

function isSetor(valor: string): valor is Setor {
  return (SECTORS as readonly string[]).includes(valor);
}


/* -------------------------------------------------------------------------- */
/*  Static params & metadata                                                  */
/* -------------------------------------------------------------------------- */

export function generateStaticParams() {
  return SECTORS.map((setor) => ({ setor }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; setor: string }>;
}) {
  const { locale, setor } = await params;
  if (!isSetor(setor)) return {};

  const t = await getTranslations({ locale });
  const rotulo = t(`forms.applications.${setor}`);

  return generatePageMetadata({
    locale,
    title: t("solucoes.forSector", { sector: rotulo }),
    description: t(`solucoes.setores.${setor}.tagline`),
    path: `/solucoes/${setor}`,
  });
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default async function SectorPage({
  params,
}: {
  params: Promise<{ locale: string; setor: string }>;
}) {
  const { locale, setor } = await params;
  setRequestLocale(locale);

  if (!isSetor(setor)) notFound();

  const t = await getTranslations();
  const rotulo = t(`forms.applications.${setor}`);
  const PRODUCTS = await getProdutos();
  const CASES = await getObras();

  const recommendedProducts = PRODUCTS.filter((p) =>
    p.applications.includes(setor)
  );
  const relatedCases = CASES.filter((c) => c.application === setor);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Soluções", url: "/pt-BR/solucoes" },
    { name: rotulo, url: `/pt-BR/solucoes/${setor}` },
  ]);

  return (
    <main className="pt-[var(--header-height)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }}
      />

      {/* ------------------------------------------------------------------ */}
      {/*  Breadcrumb                                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-b border-pili-mist bg-pili-paper px-6 py-3 lg:px-8">
        <Breadcrumbs
          className="mx-auto max-w-6xl"
          items={[
            { name: t("common.home"), href: "/" },
            { name: t("nav.solutions"), href: "/solucoes" },
            { name: rotulo },
          ]}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  Hero                                                              */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative bg-pili-black px-6 py-24 lg:px-8 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-pili-black via-pili-black/90 to-pili-graphite/80" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
            {t("nav.solutions")} / {rotulo}
          </span>
          <h1 className="mt-4 font-display text-[length:var(--text-display-1)] font-black uppercase leading-[0.9] tracking-tight text-pili-white">
            {t(`solucoes.setores.${setor}.headline`)}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pili-cement">
            {t(`solucoes.setores.${setor}.tagline`)}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#orcamento"
              className="inline-flex items-center justify-center bg-pili-safety px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
            >
              {t("common.requestQuote")}
            </a>
            <a
              href="#produtos"
              className="inline-flex items-center justify-center border border-pili-white px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-white hover:text-pili-black"
            >
              {t("hero.cta_secondary")}
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Problem / Solution                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-pili-paper py-20 px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          {/* Problem */}
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-pili-cement">
              {t("solucoes.challenge")}
            </span>
            <h2 className="mt-3 font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              {t("solucoes.problem")}
            </h2>
            <p className="mt-4 leading-relaxed text-pili-iron">
              {t(`solucoes.setores.${setor}.problema`)}
            </p>
          </div>

          {/* Solution */}
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
              {t("solucoes.answer")}
            </span>
            <h2 className="mt-3 font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              {t("solucoes.solution")}
            </h2>
            <p className="mt-4 leading-relaxed text-pili-iron">
              {t(`solucoes.setores.${setor}.solucao`)}
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Recommended products                                              */}
      {/* ------------------------------------------------------------------ */}
      {recommendedProducts.length > 0 && (
        <section id="produtos" className="py-20 px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <span className="font-mono text-xs uppercase tracking-widest text-pili-cement">
              {t("solucoes.equipment")}
            </span>
            <h2 className="mt-3 font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              {t("solucoes.recommendedFor", { sector: rotulo })}
            </h2>
            <p className="mt-4 max-w-2xl text-pili-concrete">
              {t("solucoes.recommendedText", {
                sector: rotulo.toLowerCase(),
                min:
                  recommendedProducts[recommendedProducts.length - 1]
                    ?.capacity ?? "",
                max: recommendedProducts[0]?.capacity ?? "",
              })}
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  name={product.name}
                  slug={product.slug}
                  category={product.category}
                  capacity={product.capacity}
                  length={product.length}
                        image={product.image}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/*  Related cases                                                     */}
      {/* ------------------------------------------------------------------ */}
      {relatedCases.length > 0 && (
        <section className="bg-pili-paper py-20 px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <span className="font-mono text-xs uppercase tracking-widest text-pili-cement">
              {t("solucoes.provenResults")}
            </span>
            <h2 className="mt-3 font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              {t("solucoes.successCases")}
            </h2>

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {relatedCases.map((caseItem) => (
                <Link
                  key={caseItem.slug}
                  href={`/obras/${caseItem.slug}`}
                  className="group border border-pili-mist bg-pili-white p-8 transition-all hover:border-pili-black"
                >
                  <span className="font-mono text-xs uppercase tracking-wider text-pili-cement">
                    {caseItem.client} &middot; {caseItem.location} &middot;{" "}
                    {caseItem.year}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-bold uppercase leading-tight text-pili-black">
                    {caseItem.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-pili-concrete">
                    {caseItem.summary}
                  </p>

                  {caseItem.metrics.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-6">
                      {caseItem.metrics.map((m) => (
                        <div key={m.label}>
                          <span className="font-display text-2xl font-black text-pili-black">
                            {m.value}
                          </span>
                          <span className="ml-1.5 font-mono text-[10px] uppercase tracking-wider text-pili-cement">
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-wider text-pili-black transition-colors group-hover:text-pili-safety-deep">
                    {t("solucoes.seeCase")} &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/*  CTA / Lead form                                                   */}
      {/* ------------------------------------------------------------------ */}
      <section id="orcamento" className="bg-pili-graphite py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-[length:var(--text-h2)] font-black uppercase text-pili-white">
            {t("common.requestQuote")}
          </h2>
          <p className="mt-3 text-center text-sm text-pili-cement">
            {t("solucoes.quoteSubtitle", { sector: rotulo.toLowerCase() })}
          </p>
          <div className="mt-10">
            <LeadForm dark source={`SOLUCAO_${setor.toUpperCase()}`} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Other sectors                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
            {t("solucoes.otherSolutions")}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SECTORS.filter((s) => s !== setor).map((s) => (
              <Link
                key={s}
                href={`/solucoes/${s}`}
                className="group border border-pili-mist bg-pili-white p-6 transition-all hover:border-pili-black"
              >
                <h3 className="font-display text-lg font-bold uppercase text-pili-black">
                  {t(`forms.applications.${s}`)}
                </h3>
                <p className="mt-2 text-sm text-pili-concrete line-clamp-2">
                  {t(`solucoes.setores.${s}.tagline`)}
                </p>
                <span className="mt-4 block text-xs font-semibold uppercase tracking-wider text-pili-concrete transition-colors group-hover:text-pili-safety-deep">
                  {t("common.seeSolution")} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
