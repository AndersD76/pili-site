import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { STATS } from "@/lib/constants";
import { getFeaturedProducts } from "@/lib/data/products";
import { getFeaturedCases } from "@/lib/data/cases";
import { StatsBand } from "@/components/marketing/stats-band";
import { ProductCard } from "@/components/marketing/product-card";
import { EcosystemGrid } from "@/components/marketing/ecosystem-grid";
import { ClientsBand } from "@/components/marketing/clients-band";
import { CertificationsBand } from "@/components/marketing/certifications-band";
import { LeadForm } from "@/components/marketing/lead-form";

export default function HomePage() {
  const t = useTranslations();
  const featuredProducts = getFeaturedProducts();
  const featuredCases = getFeaturedCases();

  return (
    <main>
      {/* 1. Hero fullscreen */}
      <section className="relative flex min-h-screen items-end bg-pili-black pb-20 px-6 lg:px-16">
        <div className="absolute inset-0 bg-gradient-to-t from-pili-black via-pili-black/80 to-pili-black/40" />
        <div className="relative z-10 max-w-4xl">
          <h1 className="font-display text-[length:var(--text-display-1)] font-black uppercase leading-[0.9] tracking-tight text-pili-white">
            {t("hero.headline")}
          </h1>
          <p className="mt-6 max-w-xl font-mono text-sm tracking-wide text-pili-cement">
            {t("hero.sub", {
              years: STATS.years,
              countries: STATS.countries,
            })}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/orcamento"
              className="inline-flex items-center justify-center bg-pili-safety px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors hover:bg-pili-safety-deep"
            >
              {t("hero.cta_primary")}
            </Link>
            <Link
              href="/produtos"
              className="inline-flex items-center justify-center border border-pili-white px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-white hover:text-pili-black"
            >
              {t("hero.cta_secondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Stats band */}
      <StatsBand />

      {/* 3. Produtos em destaque */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black">
              {t("sections.featured_products")}
            </h2>
            <Link
              href="/produtos"
              className="hidden text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors hover:text-pili-safety-deep sm:block"
            >
              {t("common.view_all")} &rarr;
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.slug}
                name={product.name}
                slug={product.slug}
                category={product.category}
                capacity={product.capacity}
                length={product.length}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Aplicacoes */}
      <section className="bg-pili-paper py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black">
            {t("sections.applications")}
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { key: "porto", label: "Porto", desc: "Descarga de alto fluxo em terminais maritimos" },
              { key: "cooperativa", label: "Cooperativa", desc: "Recepcao de graos de associados" },
              { key: "industria", label: "Industria alimenticia", desc: "Abastecimento de plantas industriais" },
              { key: "fertilizante", label: "Fertilizante", desc: "Materiais corrosivos e abrasivos" },
              { key: "cimento", label: "Cimento", desc: "Descarga de minerais e clinquer" },
            ].map((app) => (
              <Link
                key={app.key}
                href={`/solucoes/${app.key}`}
                className="group border border-pili-mist bg-pili-white p-6 transition-all hover:border-pili-black"
              >
                <h3 className="font-display text-lg font-bold uppercase text-pili-black">
                  {app.label}
                </h3>
                <p className="mt-2 text-sm text-pili-concrete">{app.desc}</p>
                <span className="mt-4 block text-xs font-semibold uppercase tracking-wider text-pili-concrete transition-colors group-hover:text-pili-safety-deep">
                  Ver solucao &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Case em destaque */}
      {featuredCases[0] && (
        <section className="py-24 px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black">
              {t("sections.featured_case")}
            </h2>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <div className="aspect-[16/10] bg-pili-steel" />
              <div className="flex flex-col justify-center">
                <span className="font-mono text-xs uppercase tracking-wider text-pili-cement">
                  {featuredCases[0].client} &middot; {featuredCases[0].location} &middot; {featuredCases[0].year}
                </span>
                <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight text-pili-black lg:text-3xl">
                  {featuredCases[0].title}
                </h3>
                <p className="mt-4 text-pili-concrete leading-relaxed">
                  {featuredCases[0].summary}
                </p>
                <div className="mt-6 flex gap-6">
                  {featuredCases[0].metrics.map((m) => (
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
                <Link
                  href={`/obras/${featuredCases[0].slug}`}
                  className="mt-8 self-start bg-pili-safety px-6 py-3 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors hover:bg-pili-safety-deep"
                >
                  Ver caso completo
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Ecossistema PILI */}
      <EcosystemGrid />

      {/* 7. Clientes */}
      <ClientsBand />

      {/* 8. Certificacoes */}
      <CertificationsBand />

      {/* 9. Blog placeholder */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black">
            {t("sections.latest_news")}
          </h2>
          <p className="mt-4 text-pili-concrete">
            Em breve: noticias, feiras e novidades da PILI Industrial.
          </p>
        </div>
      </section>

      {/* 10. CTA final com form */}
      <section className="bg-pili-graphite py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-[length:var(--text-h2)] font-black uppercase text-pili-white">
            {t("sections.cta_title")}
          </h2>
          <p className="mt-4 text-center text-pili-cement">
            {t("sections.cta_subtitle")}
          </p>
          <div className="mt-10">
            <LeadForm compact source="FORMULARIO" />
          </div>
        </div>
      </section>
    </main>
  );
}
