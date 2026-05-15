import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { STATS, COMPANY } from "@/lib/constants";
import { getFeaturedProducts } from "@/lib/data/products";
import { getFeaturedCases } from "@/lib/data/cases";
import { StatsBand } from "@/components/marketing/stats-band";
import { ProductCard } from "@/components/marketing/product-card";
import { EcosystemGrid } from "@/components/marketing/ecosystem-grid";
import { ClientsBand } from "@/components/marketing/clients-band";
import { CertificationsBand } from "@/components/marketing/certifications-band";
import { LeadForm } from "@/components/marketing/lead-form";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { FinancingSimulator } from "@/components/marketing/financing-simulator";
import {
  ArrowRight,
  Calculator,
  ChevronDown,
  Play,
} from "lucide-react";

const APPLICATION_IMAGES: Record<
  string,
  { src: string; label: string; desc: string }
> = {
  porto: {
    src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    label: "Porto",
    desc: "Terminais marítimos de alta vazão",
  },
  cooperativa: {
    src: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
    label: "Cooperativa",
    desc: "Recepção de grãos de associados",
  },
  industria: {
    src: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80",
    label: "Indústria alimentícia",
    desc: "Abastecimento de plantas industriais",
  },
  fertilizante: {
    src: "https://images.unsplash.com/photo-1592928302636-c83cf1e1c887?w=800&q=80",
    label: "Fertilizante",
    desc: "Materiais corrosivos e abrasivos",
  },
  cimento: {
    src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    label: "Cimento",
    desc: "Descarga de minerais e clínquer",
  },
};

export default function HomePage() {
  const t = useTranslations();
  const featuredProducts = getFeaturedProducts();
  const featuredCases = getFeaturedCases();

  return (
    <main>
      {/* ──── 1. HERO — Full-screen with yellow accent ──── */}
      <section className="relative flex min-h-screen items-end bg-pili-black pb-20 px-6 lg:px-16">
        <Image
          src="/images/hero-tombador.svg"
          alt="Tombador hidráulico PILI em operação"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pili-black via-pili-black/85 to-pili-black/30" />

        {/* Yellow accent bar — left side */}
        <div className="absolute left-0 top-0 h-full w-1.5 bg-pili-safety lg:w-2" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-40" />

        <div className="relative z-10 max-w-5xl">
          <AnimateOnScroll direction="up" delay={0}>
            <div className="mb-6 inline-flex items-center gap-3 border border-pili-iron/60 bg-pili-black/60 px-4 py-2 backdrop-blur-sm">
              <div className="h-2 w-2 bg-pili-safety" />
              <span className="font-mono text-xs uppercase tracking-widest text-pili-cement">
                Desde {COMPANY.founded} &middot; {STATS.equipment}{" "}
                equipamentos &middot; {STATS.countries} países
              </span>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="up" delay={0.15}>
            <h1 className="font-display text-[length:var(--text-display-1)] font-black uppercase leading-[0.85] tracking-tight text-pili-white">
              {t("hero.headline")}
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll direction="up" delay={0.3}>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px w-12 bg-pili-safety" />
              <p className="max-w-xl font-mono text-sm tracking-wide text-pili-cement">
                {t("hero.sub", {
                  years: STATS.years,
                  countries: STATS.countries,
                })}
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="up" delay={0.45}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/orcamento"
                className="group inline-flex items-center justify-center bg-pili-safety px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-all hover:bg-pili-safety-deep hover:shadow-[0_0_30px_rgba(227,30,36,0.3)]"
              >
                {t("hero.cta_primary")}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/produtos"
                className="inline-flex items-center justify-center border border-pili-white/30 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-all hover:border-pili-white hover:bg-pili-white hover:text-pili-black"
              >
                {t("hero.cta_secondary")}
              </Link>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="scroll-indicator flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-pili-cement">
              Scroll
            </span>
            <ChevronDown className="h-4 w-4 text-pili-cement" />
          </div>
        </div>
      </section>

      {/* ──── 2. STATS BAND ──── */}
      <StatsBand />

      {/* ──── 3. PRODUTOS EM DESTAQUE ──── */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <div className="flex items-end justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
                  Linha de produtos
                </span>
                <h2 className="mt-2 font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black accent-line">
                  {t("sections.featured_products")}
                </h2>
              </div>
              <Link
                href="/produtos"
                className="hidden items-center gap-2 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors hover:text-pili-safety-deep sm:inline-flex"
              >
                {t("common.view_all")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimateOnScroll>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product, index) => (
              <AnimateOnScroll key={product.slug} delay={index * 0.1}>
                <ProductCard
                  name={product.name}
                  slug={product.slug}
                  category={product.category}
                  capacity={product.capacity}
                  length={product.length}
                />
              </AnimateOnScroll>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-pili-black"
            >
              Ver todos os produtos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ──── 4. APLICACOES — with background images ──── */}
      <section className="bg-pili-black py-24 px-6 lg:px-8 stripe-pattern">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
              Setores de atuação
            </span>
            <h2 className="mt-2 font-display text-[length:var(--text-h1)] font-black uppercase text-pili-white">
              {t("sections.applications")}
            </h2>
          </AnimateOnScroll>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {Object.entries(APPLICATION_IMAGES).map(
              ([key, app], index) => (
                <AnimateOnScroll key={key} delay={index * 0.08}>
                  <Link
                    href={`/solucoes/${key}`}
                    className="group relative block aspect-[3/4] overflow-hidden sm:aspect-auto sm:h-72"
                  >
                    <Image
                      src={app.src}
                      alt={app.label}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pili-black via-pili-black/50 to-transparent transition-all group-hover:from-pili-black/90" />

                    {/* Yellow top accent */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-pili-safety opacity-0 transition-opacity group-hover:opacity-100" />

                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="font-display text-lg font-bold uppercase text-pili-white">
                        {app.label}
                      </h3>
                      <p className="mt-1 text-xs text-pili-cement transition-colors group-hover:text-pili-mist">
                        {app.desc}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-pili-safety opacity-0 transition-all group-hover:opacity-100">
                        Ver solução
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                </AnimateOnScroll>
              )
            )}
          </div>
        </div>
      </section>

      {/* ──── 5. CASE EM DESTAQUE ──── */}
      {featuredCases[0] && (
        <section className="py-24 px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <AnimateOnScroll>
              <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
                Referência comprovada
              </span>
              <h2 className="mt-2 font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black accent-line">
                {t("sections.featured_case")}
              </h2>
            </AnimateOnScroll>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <AnimateOnScroll direction="left">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
                    alt={featuredCases[0].title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pili-black/60 to-transparent" />
                  {/* Yellow corner accent */}
                  <div className="absolute left-0 top-0 h-20 w-1 bg-pili-safety" />
                  <div className="absolute left-0 top-0 h-1 w-20 bg-pili-safety" />
                </div>
              </AnimateOnScroll>
              <AnimateOnScroll direction="right" delay={0.15}>
                <div className="flex flex-col justify-center">
                  <span className="font-mono text-xs uppercase tracking-wider text-pili-cement">
                    {featuredCases[0].client} &middot;{" "}
                    {featuredCases[0].location} &middot;{" "}
                    {featuredCases[0].year}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight text-pili-black lg:text-3xl">
                    {featuredCases[0].title}
                  </h3>
                  <p className="mt-4 text-pili-concrete leading-relaxed">
                    {featuredCases[0].summary}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-6 border-t border-pili-mist pt-6">
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
                    className="mt-8 inline-flex self-start items-center gap-2 bg-pili-safety px-6 py-3 text-sm font-semibold uppercase tracking-wider text-pili-white transition-all hover:bg-pili-safety-deep hover:shadow-[0_0_20px_rgba(227,30,36,0.2)]"
                  >
                    Ver caso completo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>
      )}

      {/* ──── 6. VIDEO CTA ──── */}
      <section className="relative bg-pili-graphite py-32 px-6 lg:px-8">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative mx-auto max-w-4xl text-center">
          <AnimateOnScroll>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-pili-safety/40 transition-all hover:border-pili-safety hover:shadow-[0_0_40px_rgba(227,30,36,0.2)]">
              <Play className="h-8 w-8 text-pili-safety" />
            </div>
            <h2 className="mt-8 font-display text-[length:var(--text-h2)] font-black uppercase text-pili-white">
              Veja nossos equipamentos em ação
            </h2>
            <p className="mt-4 text-pili-cement">
              Mais de {STATS.equipment} tombadores instalados em {STATS.countries}{" "}
              países. Assista ao funcionamento dos nossos equipamentos em
              operações reais.
            </p>
            <a
              href="https://www.youtube.com/channel/UCkjB-kHuDaB9tKHtFcp-S8g"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 border border-pili-iron px-6 py-3 text-sm font-semibold uppercase tracking-wider text-pili-mist transition-all hover:border-pili-safety hover:text-pili-white"
            >
              Canal PILI no YouTube
              <ArrowRight className="h-4 w-4" />
            </a>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ──── 7. SIMULADOR DE FINANCIAMENTO ──── */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <FinancingSimulator />
        </div>
      </section>

      {/* ──── 8. CALCULADORA CTA ──── */}
      <section className="bg-pili-paper py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <AnimateOnScroll>
            <Calculator className="mx-auto h-12 w-12 text-pili-safety" />
            <h2 className="mt-6 font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              Dimensione seu tombador
            </h2>
            <p className="mt-4 text-pili-concrete">
              Use nossa calculadora de capacidade para descobrir qual modelo PILI
              é o ideal para a sua operação. Informe o volume diário e o tipo de
              produto para receber uma recomendação personalizada.
            </p>
            <Link
              href="/calculadora"
              className="mt-8 inline-flex items-center gap-2 bg-pili-black px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-all hover:bg-pili-graphite"
            >
              Acessar calculadora
              <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ──── 9. ECOSSISTEMA PILI ──── */}
      <EcosystemGrid />

      {/* ──── 10. CLIENTES ──── */}
      <ClientsBand />

      {/* ──── 11. CERTIFICACOES ──── */}
      <CertificationsBand />

      {/* ──── 12. CTA FINAL COM FORM ──── */}
      <section className="relative bg-pili-graphite py-24 px-6 lg:px-8">
        <div className="absolute inset-0 stripe-pattern" />
        <div className="relative mx-auto max-w-3xl">
          <AnimateOnScroll>
            <h2 className="text-center font-display text-[length:var(--text-h2)] font-black uppercase text-pili-white">
              {t("sections.cta_title")}
            </h2>
            <p className="mt-4 text-center text-pili-cement">
              {t("sections.cta_subtitle")}
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.2}>
            <div className="mt-10">
              <LeadForm compact source="FORMULARIO" />
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  );
}
