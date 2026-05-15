import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { PRODUCTS } from "@/lib/data/products";
import { CASES } from "@/lib/data/cases";
import { ProductCard } from "@/components/marketing/product-card";
import { LeadForm } from "@/components/marketing/lead-form";
import {
  generatePageMetadata,
  generateBreadcrumbJsonLd,
} from "@/lib/seo";

/* -------------------------------------------------------------------------- */
/*  Sector data                                                               */
/* -------------------------------------------------------------------------- */

const SECTORS: Record<
  string,
  {
    label: string;
    headline: string;
    description: string;
    problem: string;
    solution: string;
  }
> = {
  porto: {
    label: "Porto",
    headline: "Descarga de alto fluxo em terminais portuários",
    description:
      "Tombadores hidráulicos projetados para a exigência máxima de terminais marítimos: operação 24/7, ambiente corrosivo e fluxo acima de 700 caminhões por dia.",
    problem:
      "Terminais portuários operam sob pressão constante de navios aguardando carga. Qualquer parada não programada gera multas de sobre-estadia (demurrage) que podem ultrapassar USD 50.000 por dia. Equipamentos convencionais não suportam o ritmo de operação contínua em ambiente salino.",
    solution:
      "A PILI desenvolve tombadores de 26 e 30 metros com sistema hidráulico redundante, tratamento anticorrosivo de grau marítimo (jateamento SA 2.5 + epoxi de alta espessura) e automação integrada ao sistema de gestão portuária. O resultado é operação ininterrupta com ciclo inferior a 2,5 minutos e manutenção previsível.",
  },
  cooperativa: {
    label: "Cooperativa",
    headline: "Recepção ágil de grãos na safra e entressafra",
    description:
      "Soluções de descarga dimensionadas para o pico de safra, quando centenas de caminhões chegam simultaneamente e cada minuto de espera custa produtividade ao associado.",
    problem:
      "Durante o pico de safra, cooperativas enfrentam filas de caminhões que podem ultrapassar 12 horas de espera. Equipamentos subdimensionados ou com ciclos longos geram congestionamento, insatisfação dos associados e risco de perda de qualidade dos grãos expostos ao sol.",
    solution:
      "A linha PILI oferece tombadores de 9 a 30 metros com ciclo de 1 a 2,5 minutos, cobrindo desde unidades receptoras menores até terminais regionais de grande porte. A instalação modular permite montagem em até 30 dias, garantindo operação antes do início da safra.",
  },
  industria: {
    label: "Indústria alimentícia",
    headline: "Abastecimento contínuo de plantas industriais",
    description:
      "Tombadores especificados para alimentar linhas de produção que não podem parar: moagem, extrusão, ração e processamento de grãos em escala industrial.",
    problem:
      "Paradas de linha em plantas industriais custam milhares de reais por hora. O abastecimento depende de descarga rápida e confiável de matéria-prima, muitas vezes com frota diversificada de trucks, bi-trucks e carretas de diferentes comprimentos.",
    solution:
      "Tombadores PILI de 10 a 26 metros aceitam toda a frota rodoviária brasileira, com automação PLC que permite integração direta ao sistema MES/ERP da planta. Sensores de posição e segurança NR-12 garantem operação segura sem supervisão constante.",
  },
  fertilizante: {
    label: "Fertilizante",
    headline: "Descarga de materiais corrosivos e abrasivos",
    description:
      "Tombadores com engenharia anticorrosiva especial para granulados, pó e mistura de fertilizantes — materiais que destroem equipamentos convencionais em meses.",
    problem:
      "Fertilizantes são altamente corrosivos e abrasivos. Equipamentos sem proteção adequada sofrem degradação acelerada, resultando em paradas frequentes, custos de manutenção elevados e risco de contaminação cruzada entre lotes.",
    solution:
      "A PILI desenvolve versões especiais com revestimento interno em aço inox 316L, vedação reforçada em todos os pontos de contato e sistema de lavagem automática entre lotes. O projeto elimina pontos de acúmulo de material e facilita limpeza completa.",
  },
  cimento: {
    label: "Cimento",
    headline: "Descarga de minerais, clínquer e matéria-prima",
    description:
      "Tombadores robustos para a indústria cimenteira, projetados para suportar cargas densas, pó abrasivo e operação contínua em ambiente severo.",
    problem:
      "A indústria cimenteira trabalha com materiais de alta densidade e abrasividade — calcário, clínquer, gesso e escória. O pó gerado na descarga acelera o desgaste mecânico e compromete sistemas elétricos e hidráulicos convencionais.",
    solution:
      "Tombadores PILI para cimento contam com vedação IP65 nos painéis elétricos, filtros reforçados no sistema hidráulico e estrutura superdimensionada para cargas densas. O sistema de automação inclui monitoramento de desgaste e alertas preventivos de manutenção.",
  },
};

const VALID_SECTORS = Object.keys(SECTORS);

/* -------------------------------------------------------------------------- */
/*  Static params & metadata                                                  */
/* -------------------------------------------------------------------------- */

export function generateStaticParams() {
  return VALID_SECTORS.map((setor) => ({ setor }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ setor: string }>;
}) {
  const { setor } = await params;
  const sector = SECTORS[setor];
  if (!sector) return {};

  return generatePageMetadata({
    title: `Soluções para ${sector.label}`,
    description: sector.description,
    path: `/solucoes/${setor}`,
  });
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default async function SectorPage({
  params,
}: {
  params: Promise<{ setor: string }>;
}) {
  const { setor } = await params;
  const sector = SECTORS[setor];
  if (!sector) notFound();

  const recommendedProducts = PRODUCTS.filter((p) =>
    p.applications.includes(setor)
  );
  const relatedCases = CASES.filter((c) => c.application === setor);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Soluções", url: "/pt-BR/solucoes" },
    { name: sector.label, url: `/pt-BR/solucoes/${setor}` },
  ]);

  return (
    <main className="pt-[var(--header-height)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ------------------------------------------------------------------ */}
      {/*  Breadcrumb                                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-pili-paper px-6 py-3 lg:px-8">
        <div className="mx-auto max-w-6xl font-mono text-xs text-pili-cement">
          <Link href="/" className="hover:text-pili-black">
            Home
          </Link>{" "}
          /{" "}
          <span className="hover:text-pili-black">
            Soluções
          </span>{" "}
          / <span className="text-pili-black">{sector.label}</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  Hero                                                              */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative bg-pili-black px-6 py-24 lg:px-8 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-pili-black via-pili-black/90 to-pili-graphite/80" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
            Soluções / {sector.label}
          </span>
          <h1 className="mt-4 font-display text-[length:var(--text-display-1)] font-black uppercase leading-[0.9] tracking-tight text-pili-white">
            {sector.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pili-cement">
            {sector.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#orcamento"
              className="inline-flex items-center justify-center bg-pili-safety px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
            >
              Solicitar orçamento
            </a>
            <a
              href="#produtos"
              className="inline-flex items-center justify-center border border-pili-white px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-white hover:text-pili-black"
            >
              Ver produtos recomendados
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Problem / Solution                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-pili-paper py-20 px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          {/* Problem */}
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-pili-cement">
              O desafio
            </span>
            <h2 className="mt-3 font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              O problema
            </h2>
            <p className="mt-4 leading-relaxed text-pili-iron">
              {sector.problem}
            </p>
          </div>

          {/* Solution */}
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
              A resposta PILI
            </span>
            <h2 className="mt-3 font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              A solução
            </h2>
            <p className="mt-4 leading-relaxed text-pili-iron">
              {sector.solution}
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Recommended products                                              */}
      {/* ------------------------------------------------------------------ */}
      {recommendedProducts.length > 0 && (
        <section id="produtos" className="py-20 px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <span className="font-mono text-xs uppercase tracking-widest text-pili-cement">
              Equipamentos
            </span>
            <h2 className="mt-3 font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              Produtos recomendados para {sector.label}
            </h2>
            <p className="mt-4 max-w-2xl text-pili-concrete">
              Tombadores dimensionados para as exigências específicas do setor de{" "}
              {sector.label.toLowerCase()}, com capacidades de{" "}
              {recommendedProducts[recommendedProducts.length - 1]?.capacity} a{" "}
              {recommendedProducts[0]?.capacity}.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  name={product.name}
                  slug={product.slug}
                  category={product.category}
                  capacity={product.capacity}
                  length={product.length}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/*  Related cases                                                     */}
      {/* ------------------------------------------------------------------ */}
      {relatedCases.length > 0 && (
        <section className="bg-pili-paper py-20 px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <span className="font-mono text-xs uppercase tracking-widest text-pili-cement">
              Resultados comprovados
            </span>
            <h2 className="mt-3 font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              Casos de sucesso
            </h2>

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {relatedCases.map((caseItem) => (
                <Link
                  key={caseItem.slug}
                  href={`/obras/${caseItem.slug}`}
                  className="group border border-pili-mist bg-pili-white p-8 transition-all hover:border-pili-black"
                >
                  <span className="font-mono text-xs uppercase tracking-wider text-pili-cement">
                    {caseItem.client} &middot; {caseItem.location} &middot;{" "}
                    {caseItem.year}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-bold uppercase leading-tight text-pili-black">
                    {caseItem.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-pili-concrete">
                    {caseItem.summary}
                  </p>

                  {caseItem.metrics.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-6">
                      {caseItem.metrics.map((m) => (
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
                  )}

                  <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-wider text-pili-black transition-colors group-hover:text-pili-safety-deep">
                    Ver caso completo &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/*  CTA / Lead form                                                   */}
      {/* ------------------------------------------------------------------ */}
      <section id="orcamento" className="bg-pili-graphite py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-[length:var(--text-h2)] font-black uppercase text-pili-white">
            Solicitar orçamento
          </h2>
          <p className="mt-3 text-center text-sm text-pili-cement">
            Soluções para {sector.label.toLowerCase()} — preencha o formulário e
            nossa equipe de engenharia entra em contato com a especificação ideal
            para sua operação.
          </p>
          <div className="mt-10">
            <LeadForm source={`SOLUCAO_${setor.toUpperCase()}`} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Other sectors                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
            Outras soluções
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALID_SECTORS.filter((s) => s !== setor).map((s) => {
              const other = SECTORS[s]!;
              return (
                <Link
                  key={s}
                  href={`/solucoes/${s}`}
                  className="group border border-pili-mist bg-pili-white p-6 transition-all hover:border-pili-black"
                >
                  <h3 className="font-display text-lg font-bold uppercase text-pili-black">
                    {other.label}
                  </h3>
                  <p className="mt-2 text-sm text-pili-concrete line-clamp-2">
                    {other.description}
                  </p>
                  <span className="mt-4 block text-xs font-semibold uppercase tracking-wider text-pili-concrete transition-colors group-hover:text-pili-safety-deep">
                    Ver solução &rarr;
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
