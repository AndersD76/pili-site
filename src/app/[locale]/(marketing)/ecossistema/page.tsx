import { Link } from "@/i18n/routing";
import { generatePageMetadata } from "@/lib/seo";
import { ECOSYSTEM_PROJECTS } from "@/lib/data/ecosystem";
import {
  ExternalLink,
  Factory,
  Store,
  Cpu,
  BarChart3,
  Radio,
  ArrowRight,
} from "lucide-react";

export function generateMetadata() {
  return generatePageMetadata({
    title: "Ecossistema PILI",
    description:
      "Conheça o ecossistema PILI: Industrial, Store, Tech, Raste e Harbor. Tecnologia, peças, rastreabilidade e gestão de pátio industrial.",
    path: "/ecossistema",
  });
}

const BRAND_ICONS: Record<string, React.ComponentType<{ className?: string }>> =
  {
    store: Store,
    tech: Cpu,
    raste: BarChart3,
    harbor: Radio,
  };

export default function EcossistemaPage() {
  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            Ecossistema PILI
          </h1>
          <p className="mt-4 max-w-3xl text-pili-cement">
            Além de fabricar equipamentos de alta performance, a PILI desenvolve
            tecnologia própria para logística, rastreabilidade e gestão
            industrial. Cinco plataformas integradas que cobrem toda a cadeia de
            valor do agronegócio e da indústria.
          </p>
        </div>
      </section>

      {/* PILI Industrial card (first, special) */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/produtos"
            className="group block border border-pili-mist p-8 transition-all hover:border-pili-black"
          >
            <div className="flex items-center gap-4">
              <Factory className="h-10 w-10 text-pili-safety" />
              <div>
                <h2 className="font-display text-xl font-bold uppercase text-pili-black">
                  PILI Industrial
                </h2>
                <span className="font-mono text-xs uppercase tracking-wider text-pili-cement">
                  Fabricante de equipamentos desde 1979
                </span>
              </div>
            </div>
            <p className="mt-6 leading-relaxed text-pili-concrete">
              Fabricante brasileira de tombadores hidráulicos, coletores de
              amostras e unidades de transbordo. Mais de 850 equipamentos
              instalados em 18 países, com projetos de 9 a 30 metros e
              capacidade de 35 a 100 toneladas.
            </p>
            <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors group-hover:text-pili-safety-deep">
              Ver produtos
            </div>
          </Link>
        </div>
      </section>

      {/* Ecosystem project cards */}
      <section className="pb-16 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {ECOSYSTEM_PROJECTS.map((project) => {
              const Icon = BRAND_ICONS[project.slug];
              return (
                <div
                  key={project.slug}
                  className="group flex h-full flex-col border border-pili-mist p-8 transition-all hover:border-pili-black"
                >
                  <div className="flex items-center gap-4">
                    {Icon && <Icon className="h-10 w-10 text-pili-safety" />}
                    <div>
                      <h2 className="font-display text-xl font-bold uppercase text-pili-black">
                        {project.name}
                      </h2>
                      <span className="font-mono text-xs uppercase tracking-wider text-pili-cement">
                        {project.tagline}
                      </span>
                    </div>
                  </div>
                  <p className="mt-6 flex-1 leading-relaxed text-pili-concrete">
                    {project.description.slice(0, 200)}...
                  </p>

                  {/* Stats preview */}
                  <div className="mt-6 flex flex-wrap gap-6 border-t border-pili-mist pt-6">
                    {project.stats.map((stat) => (
                      <div key={stat.label}>
                        <span className="font-mono text-lg font-bold text-pili-black">
                          {stat.value}
                        </span>
                        <span className="ml-1.5 font-mono text-[10px] uppercase tracking-wider text-pili-cement">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/ecossistema/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors hover:text-pili-safety-deep"
                    >
                      Conhecer
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-pili-concrete transition-colors hover:text-pili-black"
                    >
                      Acessar plataforma
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integration CTA */}
      <section className="bg-pili-paper py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
            Plataformas integradas
          </h2>
          <p className="mt-4 text-pili-concrete">
            Todas as plataformas do ecossistema PILI compartilham dados e se
            integram nativamente. Da fabricação do equipamento ao monitoramento
            em tempo real da operação, passando pela rastreabilidade de grãos e
            gestão de pátio.
          </p>
          <Link
            href="/contato"
            className="mt-8 inline-flex items-center justify-center bg-pili-safety px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
          >
            Fale com a equipe PILI
          </Link>
        </div>
      </section>
    </main>
  );
}
