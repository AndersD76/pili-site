import { Link } from "@/i18n/routing";
import { generatePageMetadata } from "@/lib/seo";
import { ArrowRight } from "lucide-react";

export function generateMetadata() {
  return generatePageMetadata({
    title: "Solucoes por setor",
    description:
      "Solucoes de descarga para portos, cooperativas, industria alimenticia, fertilizantes e cimento.",
    path: "/solucoes",
  });
}

const SECTORS = [
  {
    slug: "porto",
    title: "Porto",
    headline: "Operacoes portuarias de alto fluxo",
    desc: "Tombadores de 26 a 30 metros para terminais maritimos com fluxo de ate 700 caminhoes por dia em operacao 24/7.",
  },
  {
    slug: "cooperativa",
    title: "Cooperativa",
    headline: "Recepcao agil de graos de associados",
    desc: "Modelos de 10 a 26 metros para cooperativas de todos os portes, com ciclos rapidos e filas reduzidas na safra.",
  },
  {
    slug: "industria",
    title: "Industria alimenticia",
    headline: "Abastecimento continuo de plantas industriais",
    desc: "Tombadores integrados a linhas de processamento com automacao e rastreabilidade de lote.",
  },
  {
    slug: "fertilizante",
    title: "Fertilizante",
    headline: "Materiais corrosivos e abrasivos",
    desc: "Versoes especiais com revestimento inox, vedacao reforcada e sistema de lavagem para operacao com fertilizantes.",
  },
  {
    slug: "cimento",
    title: "Cimento",
    headline: "Descarga de minerais e clinquer",
    desc: "Tombadores compactos e robustos para operacao com materiais densos e abrasivos na industria cimenteira.",
  },
] as const;

export default function SolucoesPage() {
  return (
    <main className="pt-[var(--header-height)]">
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            Solucoes por setor
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            Cada setor tem desafios unicos de descarga. A PILI desenvolve
            solucoes especificas para cada aplicacao.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SECTORS.map((sector) => (
              <Link
                key={sector.slug}
                href={`/solucoes/${sector.slug}`}
                className="group flex flex-col border border-pili-mist p-8 transition-all hover:border-pili-black"
              >
                <span className="font-mono text-xs uppercase tracking-wider text-pili-cement">
                  {sector.slug}
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold uppercase text-pili-black">
                  {sector.title}
                </h2>
                <p className="mt-1 text-sm font-medium text-pili-iron">
                  {sector.headline}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-pili-concrete">
                  {sector.desc}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-pili-black transition-colors group-hover:text-pili-safety-deep">
                  Ver solucao
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
