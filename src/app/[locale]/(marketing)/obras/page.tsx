import { CASES } from "@/lib/data/cases";
import { CaseCard } from "@/components/marketing/case-card";
import { Link } from "@/i18n/routing";
import { generatePageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return generatePageMetadata({
    title: "Obras",
    description:
      "Casos e projetos realizados pela PILI Industrial em portos, cooperativas e industrias no Brasil e no exterior.",
    path: "/obras",
  });
}

export default function ObrasPage() {
  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            Obras
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            Conheca os projetos realizados pela PILI Industrial. Tombadores
            instalados em portos, cooperativas, industrias e terminais
            graneleiros em mais de 18 paises.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/orcamento"
              className="bg-pili-safety px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-pili-black transition-colors hover:bg-pili-safety-deep"
            >
              Solicitar orcamento
            </Link>
            <Link
              href="/produtos"
              className="border border-pili-iron px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-pili-mist transition-colors hover:bg-pili-steel"
            >
              Ver produtos
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
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
