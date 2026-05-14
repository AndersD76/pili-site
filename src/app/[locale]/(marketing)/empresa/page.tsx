import { Link } from "@/i18n/routing";
import { generatePageMetadata } from "@/lib/seo";
import { COMPANY, STATS } from "@/lib/constants";
import { ShieldCheck, HardHat, Lightbulb } from "lucide-react";

export function generateMetadata() {
  return generatePageMetadata({
    title: "A Empresa",
    description: `${COMPANY.name}: fabricante de tombadores hidraulicos desde ${COMPANY.founded}. ${STATS.years}+ anos de experiencia, ${STATS.equipment} equipamentos instalados em ${STATS.countries} paises.`,
    path: "/empresa",
  });
}

const TIMELINE = [
  {
    year: "1979",
    title: "Fundacao",
    desc: "A PILI e fundada em Erechim/RS, inicialmente voltada para metalurgia industrial e equipamentos sob medida para o setor agroindustrial.",
  },
  {
    year: "2017",
    title: "Unidade Paranagua",
    desc: "Inauguracao da base operacional em Paranagua/PR, estrategicamente localizada junto ao maior complexo portuario de exportacao de graos da America Latina.",
  },
  {
    year: "2017",
    title: "Exportacao para o Paraguai",
    desc: "Primeiras exportacoes para o Paraguai, marcando o inicio da expansao internacional da PILI e consolidando presenca no Mercosul.",
  },
  {
    year: "Presente",
    title: "Referencia global",
    desc: `Mais de ${STATS.equipment} equipamentos instalados em ${STATS.countries} paises. Lider em tombadores hidraulicos para portos, cooperativas e industrias na America Latina.`,
  },
] as const;

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Qualidade",
    desc: "Certificacao ISO 9001, materia-prima rastreada e controle dimensional rigoroso em cada etapa da fabricacao.",
  },
  {
    icon: HardHat,
    title: "Seguranca",
    desc: "Projetos conforme NR-10, NR-12 e normas internacionais. Garantia estrutural de 5 anos em todos os equipamentos.",
  },
  {
    icon: Lightbulb,
    title: "Inovacao",
    desc: "Investimento contínuo em P&D, IoT industrial e automacao. Ecossistema digital proprio para gestao de patio e rastreabilidade.",
  },
] as const;

const LEADERSHIP = [
  {
    name: "Engenharia e Projetos",
    desc: "Equipe de engenheiros especializados em estruturas metalicas, hidraulica e automacao industrial.",
  },
  {
    name: "Producao",
    desc: "Parque fabril em Erechim/RS com capacidade para produzir e montar equipamentos de ate 30 metros.",
  },
  {
    name: "Comercial e Pos-venda",
    desc: "Atendimento consultivo com equipe tecnica dedicada para dimensionamento e suporte apos instalacao.",
  },
] as const;

export default function EmpresaPage() {
  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            A Empresa
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            Fundada em {COMPANY.founded} em Erechim/RS, a PILI Industrial e
            referencia na fabricacao de tombadores hidraulicos e plataformas de
            descarga de graos. Sao {STATS.years}+ anos de experiencia, mais de{" "}
            {STATS.equipment} equipamentos instalados em {STATS.countries}{" "}
            paises.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-pili-safety py-6 px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-8">
          {[
            { value: `${STATS.years}+`, label: "Anos de experiencia" },
            { value: STATS.equipment, label: "Equipamentos instalados" },
            { value: String(STATS.countries), label: "Paises atendidos" },
            { value: STATS.maxCapacity, label: "Capacidade maxima" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="font-display text-3xl font-black text-pili-black">
                {stat.value}
              </span>
              <span className="ml-2 font-mono text-xs uppercase tracking-wider text-pili-black/70">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Historia / Timeline */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black">
            Historia
          </h2>
          <div className="mt-12 space-y-0">
            {TIMELINE.map((event, i) => (
              <div key={i} className="relative flex gap-8 pb-12 last:pb-0">
                {/* Vertical line */}
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center border-2 border-pili-black bg-pili-white">
                    <span className="font-mono text-xs font-bold text-pili-black">
                      {event.year}
                    </span>
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div className="w-px flex-1 bg-pili-mist" />
                  )}
                </div>
                <div className="pb-4 pt-2">
                  <h3 className="font-display text-lg font-bold uppercase text-pili-black">
                    {event.title}
                  </h3>
                  <p className="mt-2 max-w-lg leading-relaxed text-pili-concrete">
                    {event.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lideranca */}
      <section className="bg-pili-paper py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black">
            Lideranca
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LEADERSHIP.map((area) => (
              <div
                key={area.name}
                className="border border-pili-mist bg-pili-white p-8"
              >
                <h3 className="font-display text-lg font-bold uppercase text-pili-black">
                  {area.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-pili-concrete">
                  {area.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black">
            Nossos valores
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value) => (
              <div key={value.title} className="flex flex-col">
                <value.icon className="h-10 w-10 text-pili-safety" />
                <h3 className="mt-4 font-display text-xl font-bold uppercase text-pili-black">
                  {value.title}
                </h3>
                <p className="mt-3 leading-relaxed text-pili-concrete">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-pili-graphite py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-white">
            Conheca nossos produtos
          </h2>
          <p className="mt-4 text-pili-cement">
            Tombadores hidraulicos de 9 a 30 metros, coletores de amostras e
            equipamentos especiais. Fabricados em Erechim/RS com aco de alta
            resistencia.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/produtos"
              className="bg-pili-safety px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors hover:bg-pili-safety-deep"
            >
              Ver produtos
            </Link>
            <Link
              href="/contato"
              className="border border-pili-white px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-white hover:text-pili-black"
            >
              Fale conosco
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
