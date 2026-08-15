import { setRequestLocale, getTranslations } from "next-intl/server";
import { getProdutosDestaque, getObrasDestaque } from "@/lib/content";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { getSiteSettings, anosDeMercado } from "@/lib/site-settings";
import { StatsBand } from "@/components/marketing/stats-band";
import { HeroCarousel } from "@/components/marketing/hero-carousel";
import { getHeroSlides, type SlideData } from "@/lib/hero-slides";
import { getSetores } from "@/lib/setores";
import { ProductCard } from "@/components/marketing/product-card";
import { EcosystemGrid } from "@/components/marketing/ecosystem-grid";
import { CertificationsBand } from "@/components/marketing/certifications-band";
import { LeadForm } from "@/components/marketing/lead-form";
import {
  Modelo3DModal,
  type Hotspot3D,
} from "@/components/marketing/modelo-3d-modal";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import {
  ArrowRight,
  Calculator,
  ChevronDown,
  Play,
  TrendingUp,
} from "lucide-react";

import type { Metadata } from "next";
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
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return generatePageMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDesc"),
    path: "",
  });
}


/** Usada enquanto o setor não tem foto própria enviada pelo painel. */
const FOTO_SETOR_PADRAO = "/images/tombador-pili.jpg";

const HOTSPOTS_TOMBADOR: Hotspot3D[] = [
  { position: "0 0.005 0.018", normal: "0 0 1", label: "Fundacao" },
  { position: "0.018 0.04 0", normal: "1 0 0", label: "Plataforma" },
  { position: "0.018 0.12 0", normal: "1 0 0", label: "Cilindros hidraulicos" },
  { position: "-0.018 0.18 0", normal: "-1 0 0", label: "Portico" },
  { position: "0 0.235 0.018", normal: "0 0 1", label: "Tombador" },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const featuredProducts = await getProdutosDestaque();
  const featuredCases = await getObrasDestaque();
  // Números e dados institucionais vêm do painel, não mais de constants.ts.
  const settings = await getSiteSettings();
  const anos = anosDeMercado(settings);

  // Sem slide cadastrado o hero cai na imagem e no título padrão, montados
  // como um slide só — um caminho de render em vez de dois.
  const setores = await getSetores();
  const doBanco = await getHeroSlides();
  const slides: SlideData[] =
    doBanco.length > 0
      ? doBanco
      : [
          {
            id: "padrao",
            imagem: "/images/tombador-pili.jpg",
            alt: t("home.heroAlt"),
            titulo: t("hero.headline"),
            subtitulo: t("hero.sub", {
              years: anos,
              countries: settings.statsPaises,
            }),
          },
        ];

  return (
    <main>
      {/* ──── 1. HERO — carrossel gerenciado em /admin/hero ──── */}
      <section className="relative flex min-h-svh items-center bg-pili-black px-6 pb-16 pt-[calc(var(--header-height)+2.5rem)] lg:px-16">
        <HeroCarousel
          slides={slides}
          badge={
            <div className="mb-5 inline-flex items-center gap-3 border border-pili-iron/60 bg-pili-black/60 px-4 py-2 backdrop-blur-sm">
              <div className="h-2 w-2 bg-pili-safety" />
              <span className="font-mono text-xs uppercase tracking-widest text-pili-cement">
                Desde {settings.fundacao} &middot;{" "}
                {settings.statsEquipamentos} equipamentos &middot;{" "}
                {settings.statsPaises} países
              </span>
            </div>
          }
          acoes={
            <div className="mt-8 flex flex-wrap gap-4">
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
          }
        />

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
      <StatsBand
        anos={anos}
        equipamentos={settings.statsEquipamentos}
        paises={settings.statsPaises}
        capacidade={settings.statsCapacidade}
      />

      {/* ──── 3. PRODUTOS EM DESTAQUE ──── */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <div className="flex items-end justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
                  {t("home.productsTitle")}
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
                        image={product.image}
                />
              </AnimateOnScroll>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-pili-black"
            >
              {t("home.productsAll")}
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
              {t("home.sectorsTitle")}
            </span>
            <h2 className="mt-2 font-display text-[length:var(--text-h1)] font-black uppercase text-pili-white">
              {t("sections.applications")}
            </h2>
          </AnimateOnScroll>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {setores.map((setor, index) => (
              <AnimateOnScroll key={setor.slug} delay={index * 0.08}>
                <Link
                  href={`/solucoes/${setor.slug}`}
                  className="group relative block aspect-[3/4] overflow-hidden sm:aspect-auto sm:h-72"
                >
                  <Image
                    src={setor.imagem ?? FOTO_SETOR_PADRAO}
                    alt={
                      setor.alt ??
                      setor.titulo ??
                      t(`forms.applications.${setor.slug}`)
                    }
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pili-black via-pili-black/50 to-transparent transition-all group-hover:from-pili-black/90" />

                  {/* Yellow top accent */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-pili-safety opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="font-display text-lg font-bold uppercase text-pili-white">
                      {setor.titulo ?? t(`forms.applications.${setor.slug}`)}
                    </h3>
                    <p className="mt-1 text-xs text-pili-cement transition-colors group-hover:text-pili-mist">
                      {setor.descricao ?? t(`home.sectors.${setor.slug}`)}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-pili-safety opacity-0 transition-all group-hover:opacity-100">
                      {t("common.seeSolution")}
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ──── 5. CASE EM DESTAQUE ──── */}
      {featuredCases[0] && (
        <section className="py-24 px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <AnimateOnScroll>
              <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
                {t("home.caseTitle")}
              </span>
              <h2 className="mt-2 font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black accent-line">
                {t("sections.featured_case")}
              </h2>
            </AnimateOnScroll>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <AnimateOnScroll direction="left">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src="/images/tombador-pili.jpg"
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
              {t("home.videoTitle")}
            </h2>
            <p className="mt-4 text-pili-cement">
              Mais de {settings.statsEquipamentos} tombadores instalados em{" "}
              {settings.statsPaises}{" "}
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

      {/* ──── 6b. MODELO 3D ──── */}
      <section className="relative overflow-hidden bg-[#0B0B0C] py-24 px-6 lg:px-8">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="relative mx-auto max-w-4xl text-center">
          <AnimateOnScroll>
            <p className="font-mono text-xs uppercase tracking-widest text-pili-red">
              Experiencia interativa
            </p>
            <h2 className="mt-4 font-display text-[length:var(--text-h2)] font-black uppercase text-white">
              Explore o equipamento em 3D
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pili-cement">
              Visualize o tombador hidraulico em detalhes. Gire, amplie e
              inspecione cada angulo do equipamento que movimenta
              mais de {settings.statsEquipamentos} operacoes pelo mundo.
            </p>
            <div className="mt-10">
              <Modelo3DModal
                src="/models/tombador.glb"
                alt="Tombador hidraulico PILI — instalacao completa"
                titulo="Tombador Hidraulico PILI"
                hotspots={HOTSPOTS_TOMBADOR}
              />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ──── 7. DIMENSIONE SEU TOMBADOR ──── */}
      <section className="bg-pili-paper py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <AnimateOnScroll>
            <Calculator className="mx-auto h-12 w-12 text-pili-safety" />
            <h2 className="mt-6 font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              {t("home.calcTitle")}
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

      {/* ──── 8. PAYBACK — ROI DO TOMBADOR ──── */}
      <section className="bg-pili-black py-24 px-6 lg:px-8 stripe-pattern">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-0 lg:grid-cols-2">
            <AnimateOnScroll direction="left">
              <div className="flex h-full flex-col justify-center p-10 lg:p-14">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-pili-safety" />
                  <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
                    Retorno sobre investimento
                  </span>
                </div>
                <h2 className="mt-6 font-display text-[length:var(--text-h2)] font-black uppercase leading-tight text-pili-white">
                  {t("home.paybackTitle")}
                </h2>
                <p className="mt-4 leading-relaxed text-pili-cement">
                  Descubra em quanto tempo o investimento em um tombador PILI se
                  paga. Nossos equipamentos reduzem custos operacionais, eliminam
                  filas e aumentam a produtividade da sua operação.
                </p>
                <ul className="mt-6 space-y-3">
                  {(
                    [
                      "espera",
                      "demurrage",
                      "produtividade",
                      "manutencao",
                      "payback",
                    ] as const
                  ).map((chave) => (
                    <li
                      key={chave}
                      className="flex items-start gap-3 text-sm text-pili-mist"
                    >
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-pili-safety" />
                      {t(`home.benefits.${chave}`)}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/orcamento"
                  className="mt-8 inline-flex self-start items-center gap-2 bg-pili-safety px-6 py-3 text-sm font-semibold uppercase tracking-wider text-pili-white transition-all hover:bg-pili-safety-deep"
                >
                  {t("home.paybackCta")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll direction="right" delay={0.15}>
              <div className="flex h-full flex-col justify-center bg-pili-graphite p-10 lg:p-14">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <span className="font-display text-4xl font-black text-pili-safety">60%</span>
                    <span className="mt-2 block font-mono text-[10px] uppercase tracking-wider text-pili-cement">
                      redução tempo de espera
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="font-display text-4xl font-black text-pili-safety">45s</span>
                    <span className="mt-2 block font-mono text-[10px] uppercase tracking-wider text-pili-cement">
                      ciclo médio descarga
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="font-display text-4xl font-black text-pili-safety">R$2M</span>
                    <span className="mt-2 block font-mono text-[10px] uppercase tracking-wider text-pili-cement">
                      economia por safra
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="font-display text-4xl font-black text-pili-safety">24</span>
                    <span className="mt-2 block font-mono text-[10px] uppercase tracking-wider text-pili-cement">
                      meses payback médio
                    </span>
                  </div>
                </div>
                <div className="mt-10 border-t border-pili-iron pt-8">
                  <p className="font-display text-lg font-bold uppercase text-pili-white">
                    Exemplo real
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-pili-cement">
                    Terminal portuário em Paranaguá: investimento de R$ 2,4M em 2
                    tombadores de 30m. Economia de R$ 1,2M/ano em demurrage e
                    ganho de 40% de produtividade. Payback em 20 meses.
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ──── 9. ECOSSISTEMA PILI ──── */}
      <EcosystemGrid />

      {/* A faixa "Quem confia na PILI" saiu daqui. Ela nomeava Cargill, JBS,
          BRF, Votorantim e COFCO com números de operação por cliente. Esses
          dados vêm das obras semeadas em `seed-all.ts`, que são material de
          demonstração: atribuir desempenho medido a terceiro nomeado sem
          contrato de divulgação é exposição, não prova social. */}

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
              <LeadForm compact dark source="FORMULARIO" />
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  );
}
