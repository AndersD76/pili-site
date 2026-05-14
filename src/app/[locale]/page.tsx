import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { STATS, COMPANY } from "@/lib/constants";

export default function HomePage() {
  const t = useTranslations();

  return (
    <main>
      {/* Hero */}
      <section className="relative flex min-h-screen items-end bg-pili-black pb-20 px-6 lg:px-16">
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

      {/* Stats Band */}
      <section className="bg-pili-black py-16 border-t border-pili-iron">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 lg:grid-cols-4 lg:px-16">
          {[
            { value: STATS.years, label: t("stats.years", { count: STATS.years }) },
            { value: STATS.equipment, label: t("stats.equipment", { count: STATS.equipment }) },
            { value: STATS.countries, label: t("stats.countries", { count: STATS.countries }) },
            { value: STATS.maxCapacity, label: t("stats.capacity", { count: STATS.maxCapacity }) },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl font-black text-pili-safety lg:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 font-mono text-xs uppercase tracking-widest text-pili-cement">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Placeholder sections */}
      <section className="py-24 px-6 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black">
            {t("sections.featured_products")}
          </h2>
          <p className="mt-4 text-pili-concrete">
            Tombadores de 9 a 30 metros em breve aqui.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-pili-graphite py-24 px-6 lg:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-white">
            {t("sections.cta_title")}
          </h2>
          <p className="mt-4 text-pili-cement">
            {t("sections.cta_subtitle")}
          </p>
          <Link
            href="/contato"
            className="mt-8 inline-flex items-center justify-center bg-pili-safety px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors hover:bg-pili-safety-deep"
          >
            {t("common.talk_specialist")}
          </Link>
        </div>
      </section>

      {/* Footer placeholder */}
      <footer className="bg-pili-black py-16 px-6 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="font-display text-2xl font-black uppercase text-pili-white">
              PILI Industrial
            </span>
            <p className="font-mono text-xs text-pili-concrete">
              {COMPANY.name} · CNPJ {COMPANY.cnpj} · {COMPANY.address}
            </p>
            <p className="font-mono text-xs text-pili-concrete">
              &copy; {new Date().getFullYear()} PILI Industrial · {t("footer.rights")}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
