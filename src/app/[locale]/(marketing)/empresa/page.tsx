import { Link } from "@/i18n/routing";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { generatePageMetadata } from "@/lib/seo";
import { getSiteSettings, anosDeMercado } from "@/lib/site-settings";
import { ShieldCheck, HardHat, Lightbulb, ArrowRight } from "lucide-react";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { StatsBand } from "@/components/marketing/stats-band";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "empresa" });
  const settings = await getSiteSettings();
  return generatePageMetadata({
    locale,
    title: t("title"),
    description: t("metaDesc", {
      name: settings.razaoSocial,
      founded: settings.fundacao,
      years: anosDeMercado(settings),
      equipment: settings.statsEquipamentos,
      countries: settings.statsPaises,
    }),
    path: "/empresa",
  });
}

/** Ano na linha do tempo; título e texto vêm de `empresa.timeline`. */
const TIMELINE = [
  { year: "1979", key: "fundacao" },
  { year: "1990", key: "primeiroTombador" },
  { year: "2010", key: "expansao" },
  { year: "2017", key: "paranagua" },
  { year: "2020", key: "ecossistema" },
  { year: null, key: "global" },
] as const;

const VALUES = [
  { icon: ShieldCheck, key: "qualidade" },
  { icon: HardHat, key: "seguranca" },
  { icon: Lightbulb, key: "inovacao" },
] as const;

const AREAS = ["engenharia", "producao", "posVenda"] as const;

export default async function EmpresaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  // Institucionais e números vêm do painel.
  const settings = await getSiteSettings();
  const anos = anosDeMercado(settings);

  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="relative bg-pili-black py-32 px-6 lg:px-8">
        <Image
          src="/images/tombador-pili.jpg"
          alt={t("empresa.imageAlt")}
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute left-0 top-0 h-full w-1.5 bg-pili-safety" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="relative mx-auto max-w-6xl">
          <AnimateOnScroll>
            <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
              {t("empresa.since", { year: settings.fundacao })}
            </span>
            <h1 className="mt-3 font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
              {t("empresa.title")}
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <div className="h-px w-12 bg-pili-safety" />
              <p className="max-w-2xl text-pili-cement">
                {t("empresa.intro", {
                  year: settings.fundacao,
                  years: anos,
                  equipment: settings.statsEquipamentos,
                  countries: settings.statsPaises,
                })}
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Stats */}
      <StatsBand
        anos={anos}
        equipamentos={settings.statsEquipamentos}
        paises={settings.statsPaises}
        capacidade={settings.statsCapacidade}
      />

      {/* Historia / Timeline */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
              {t("empresa.trajectory")}
            </span>
            <h2 className="mt-2 font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black accent-line">
              {t("empresa.history")}
            </h2>
          </AnimateOnScroll>
          <div className="mt-16 space-y-0">
            {TIMELINE.map((event, i) => (
              <AnimateOnScroll key={i} delay={i * 0.1}>
                <div className="relative flex gap-8 pb-12 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center border-2 border-pili-black bg-pili-white">
                      <span className="font-mono text-xs font-bold text-pili-black">
                        {event.year ?? t("empresa.today")}
                      </span>
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className="w-px flex-1 bg-pili-mist" />
                    )}
                  </div>
                  <div className="pb-4 pt-3">
                    <h3 className="font-display text-lg font-bold uppercase text-pili-black">
                      {t(`empresa.timeline.${event.key}.title`)}
                    </h3>
                    <p className="mt-2 max-w-lg leading-relaxed text-pili-concrete">
                      {event.key === "global"
                        ? t("empresa.globalText", {
                            equipment: settings.statsEquipamentos,
                            countries: settings.statsPaises,
                          })
                        : t(`empresa.timeline.${event.key}.text`)}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-pili-paper py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
              {t("empresa.values")}
            </span>
            <h2 className="mt-2 font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black accent-line">
              {t("empresa.ourValues")}
            </h2>
          </AnimateOnScroll>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value, i) => (
              <AnimateOnScroll key={value.key} delay={i * 0.1}>
                <div className="border-t-2 border-t-pili-safety bg-pili-white p-8">
                  <value.icon className="h-10 w-10 text-pili-safety" />
                  <h3 className="mt-4 font-display text-xl font-bold uppercase text-pili-black">
                    {t(`empresa.pillars.${value.key}.title`)}
                  </h3>
                  <p className="mt-3 leading-relaxed text-pili-concrete">
                    {t(`empresa.pillars.${value.key}.text`)}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Infraestrutura */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
              {t("empresa.capacity")}
            </span>
            <h2 className="mt-2 font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black accent-line">
              {t("empresa.infrastructure")}
            </h2>
          </AnimateOnScroll>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AREAS.map((area, i) => (
              <AnimateOnScroll key={area} delay={i * 0.1}>
                <div className="border border-pili-mist p-8 transition-all hover:border-pili-black">
                  <h3 className="font-display text-lg font-bold uppercase text-pili-black">
                    {area === "engenharia"
                      ? t("empresa.engineering")
                      : t(`empresa.pillars.${area}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-pili-concrete">
                    {t(`empresa.pillars.${area}.text`)}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-pili-graphite py-24 px-6 lg:px-8 stripe-pattern">
        <div className="relative mx-auto max-w-4xl text-center">
          <AnimateOnScroll>
            <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-white">
              {t("empresa.seeProducts")}
            </h2>
            <p className="mt-4 text-pili-cement">
              {t("produtos.intro")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/produtos"
                className="inline-flex items-center gap-2 bg-pili-safety px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
              >
                {t("hero.cta_secondary")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contato"
                className="border border-pili-white px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-white hover:text-pili-black"
              >
                {t("contato.talkToUs")}
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  );
}
