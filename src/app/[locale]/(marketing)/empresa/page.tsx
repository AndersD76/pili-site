import { Link } from "@/i18n/routing";
import Image from "next/image";
import { generatePageMetadata } from "@/lib/seo";
import { COMPANY, STATS } from "@/lib/constants";
import { ShieldCheck, HardHat, Lightbulb, ArrowRight } from "lucide-react";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { StatsBand } from "@/components/marketing/stats-band";

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
    year: "1990",
    title: "Primeiro tombador",
    desc: "Desenvolvimento do primeiro tombador hidraulico PILI, marcando o inicio da especializacao em plataformas de descarga de graos.",
  },
  {
    year: "2010",
    title: "Expansao nacional",
    desc: "A PILI ultrapassa 300 equipamentos instalados no Brasil, consolidando-se como lider em tombadores hidraulicos no mercado nacional.",
  },
  {
    year: "2017",
    title: "Unidade Paranagua",
    desc: "Inauguracao da base operacional em Paranagua/PR, junto ao maior complexo portuario de exportacao de graos da America Latina.",
  },
  {
    year: "2020",
    title: "Ecossistema digital",
    desc: "Lancamento das plataformas PILI Tech, Store e Raste, integrando IoT, e-commerce e rastreabilidade ao portfolio de solucoes.",
  },
  {
    year: "Hoje",
    title: "Referencia global",
    desc: `Mais de ${STATS.equipment} equipamentos em ${STATS.countries} paises. Ecossistema completo de hardware + software para a cadeia do agronegocio.`,
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
    desc: "Investimento continuo em P&D, IoT industrial e automacao. Ecossistema digital proprio para gestao de patio e rastreabilidade.",
  },
] as const;

export default function EmpresaPage() {
  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="relative bg-pili-black py-32 px-6 lg:px-8">
        <Image
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
          alt="Industrial manufacturing"
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute left-0 top-0 h-full w-1.5 bg-pili-safety" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="relative mx-auto max-w-6xl">
          <AnimateOnScroll>
            <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
              Desde {COMPANY.founded}
            </span>
            <h1 className="mt-3 font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
              A Empresa
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <div className="h-px w-12 bg-pili-safety" />
              <p className="max-w-2xl text-pili-cement">
                Fundada em {COMPANY.founded} em Erechim/RS, a PILI Industrial e
                referencia na fabricacao de tombadores hidraulicos e plataformas
                de descarga de graos. Sao {STATS.years}+ anos de experiencia,
                mais de {STATS.equipment} equipamentos instalados em{" "}
                {STATS.countries} paises.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Stats */}
      <StatsBand />

      {/* Historia / Timeline */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
              Nossa trajetoria
            </span>
            <h2 className="mt-2 font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black accent-line">
              Historia
            </h2>
          </AnimateOnScroll>
          <div className="mt-16 space-y-0">
            {TIMELINE.map((event, i) => (
              <AnimateOnScroll key={i} delay={i * 0.1}>
                <div className="relative flex gap-8 pb-12 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center border-2 border-pili-black bg-pili-white">
                      <span className="font-mono text-xs font-bold text-pili-black">
                        {event.year}
                      </span>
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className="w-px flex-1 bg-pili-mist" />
                    )}
                  </div>
                  <div className="pb-4 pt-3">
                    <h3 className="font-display text-lg font-bold uppercase text-pili-black">
                      {event.title}
                    </h3>
                    <p className="mt-2 max-w-lg leading-relaxed text-pili-concrete">
                      {event.desc}
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
              O que nos guia
            </span>
            <h2 className="mt-2 font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black accent-line">
              Nossos valores
            </h2>
          </AnimateOnScroll>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value, i) => (
              <AnimateOnScroll key={value.title} delay={i * 0.1}>
                <div className="border-t-2 border-t-pili-safety bg-pili-white p-8">
                  <value.icon className="h-10 w-10 text-pili-safety" />
                  <h3 className="mt-4 font-display text-xl font-bold uppercase text-pili-black">
                    {value.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-pili-concrete">
                    {value.desc}
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
              Capacidade produtiva
            </span>
            <h2 className="mt-2 font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black accent-line">
              Infraestrutura
            </h2>
          </AnimateOnScroll>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Engenharia e Projetos",
                desc: "Equipe de engenheiros especializados em estruturas metalicas, hidraulica e automacao industrial. Projetos em CAD 3D com simulacao estrutural.",
              },
              {
                title: "Producao",
                desc: "Parque fabril em Erechim/RS com capacidade para produzir e montar equipamentos de ate 30 metros. Corte laser, solda robotizada e jateamento.",
              },
              {
                title: "Pos-venda",
                desc: "Atendimento tecnico dedicado, pecas de reposicao via PILI Store, monitoramento remoto via PILI Tech e assistencia em campo em todo o Brasil.",
              },
            ].map((area, i) => (
              <AnimateOnScroll key={area.title} delay={i * 0.1}>
                <div className="border border-pili-mist p-8 transition-all hover:border-pili-black">
                  <h3 className="font-display text-lg font-bold uppercase text-pili-black">
                    {area.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-pili-concrete">
                    {area.desc}
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
                className="inline-flex items-center gap-2 bg-pili-safety px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
              >
                Ver produtos
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contato"
                className="border border-pili-white px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-white hover:text-pili-black"
              >
                Fale conosco
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  );
}
