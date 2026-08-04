"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import { ECOSYSTEM } from "@/lib/constants";
import { ExternalLink, Cpu, ArrowRight } from "lucide-react";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";

const BRANDS = [
  {
    name: "PILI Tech",
    href: ECOSYSTEM.tech,
    icon: Cpu,
    accent: "border-t-cyan-500",
    slug: "tech",
  },
] as const;

export function EcosystemGrid() {
  const t = useTranslations();
  return (
    <section className="bg-pili-black py-24 px-6 lg:px-8">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="mx-auto max-w-6xl">
        <AnimateOnScroll>
          <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
            {t("ecossistema.ownTech")}
          </span>
          <h2 className="mt-2 font-display text-[length:var(--text-h1)] font-black uppercase text-pili-white">
            {t("sections.ecosystem")}
          </h2>
          <div className="mt-2 flex items-center gap-4">
            <div className="h-px w-12 bg-pili-safety" />
            <p className="max-w-2xl text-pili-cement">
              {t("ecossistema.intro")}
            </p>
          </div>
        </AnimateOnScroll>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BRANDS.map((brand, index) => (
            <AnimateOnScroll key={brand.name} delay={index * 0.1}>
              <div
                className={`group flex h-full flex-col border border-pili-iron border-t-2 ${brand.accent} bg-pili-graphite p-6 transition-all duration-300 hover:bg-pili-steel`}
              >
                <brand.icon className="h-8 w-8 text-pili-safety" />
                <h3 className="mt-4 font-display text-lg font-bold uppercase text-pili-white">
                  {brand.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-pili-cement">
                  {t("ecossistema.techDesc")}
                </p>
                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    href={`/ecossistema/${brand.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-pili-white transition-colors hover:text-pili-safety"
                  >
                    {t("ecossistema.know")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <a
                    href={brand.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-pili-cement transition-colors hover:text-pili-white"
                  >
                    {t("header.openPlatform")}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
