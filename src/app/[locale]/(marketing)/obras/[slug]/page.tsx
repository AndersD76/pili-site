import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { CASES, getCase } from "@/lib/data/cases";
import { getProduct } from "@/lib/data/products";
import { LeadForm } from "@/components/marketing/lead-form";
import { generatePageMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseData = getCase(slug);
  if (!caseData) return {};
  return generatePageMetadata({
    title: caseData.title,
    description: caseData.summary,
    path: `/obras/${caseData.slug}`,
  });
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseData = getCase(slug);
  if (!caseData) notFound();

  const relatedProducts = caseData.products
    .map((pSlug) => getProduct(pSlug))
    .filter(Boolean);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Obras", url: "/pt-BR/obras" },
    { name: caseData.title, url: `/pt-BR/obras/${caseData.slug}` },
  ]);

  const contentParagraphs = caseData.content.split("\n\n");

  return (
    <main className="pt-[var(--header-height)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="bg-pili-paper px-6 py-3 lg:px-8">
        <div className="mx-auto max-w-6xl font-mono text-xs text-pili-cement">
          <Link href="/" className="hover:text-pili-black">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/obras" className="hover:text-pili-black">
            Obras
          </Link>{" "}
          / <span className="text-pili-black">{caseData.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-pili-paper pb-16 pt-8 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-wider text-pili-cement">
            <span>{caseData.client}</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>{caseData.location}</span>
            <span className="hidden sm:inline">&middot;</span>
            <span className="text-pili-safety">{caseData.year}</span>
          </div>
          <h1 className="mt-4 font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black">
            {caseData.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-pili-concrete">
            {caseData.summary}
          </p>
        </div>
      </section>

      {/* Metrics */}
      {caseData.metrics.length > 0 && (
        <section className="border-y border-pili-mist bg-pili-white py-12 px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-12 lg:gap-20">
            {caseData.metrics.map((m) => (
              <div key={m.label} className="text-center">
                <span className="font-mono text-4xl font-black text-pili-black lg:text-5xl">
                  {m.value}
                </span>
                <span className="mt-2 block font-mono text-[11px] uppercase tracking-wider text-pili-cement">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
            Sobre o projeto
          </h2>
          <div className="mt-8 space-y-6">
            {contentParagraphs.map((paragraph, i) => (
              <p
                key={i}
                className="leading-relaxed text-pili-iron"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Products used */}
      {relatedProducts.length > 0 && (
        <section className="bg-pili-paper py-16 px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              Produtos utilizados
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((product) => {
                if (!product) return null;
                return (
                  <Link
                    key={product.slug}
                    href={`/produtos/${product.slug}`}
                    className="group border border-pili-mist bg-pili-white p-6 transition-all hover:border-pili-black"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wider text-pili-cement">
                      {product.category.replace(/_/g, " ")}
                    </span>
                    <h3 className="mt-1 font-display text-xl font-bold uppercase text-pili-black">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm text-pili-concrete line-clamp-2">
                      {product.tagline}
                    </p>
                    <div className="mt-4 flex gap-6">
                      <div>
                        <span className="font-mono text-sm font-bold text-pili-black">
                          {product.capacity}
                        </span>
                        <span className="ml-1 font-mono text-[10px] uppercase tracking-wider text-pili-cement">
                          capacidade
                        </span>
                      </div>
                      <div>
                        <span className="font-mono text-sm font-bold text-pili-black">
                          {product.length}
                        </span>
                        <span className="ml-1 font-mono text-[10px] uppercase tracking-wider text-pili-cement">
                          comprimento
                        </span>
                      </div>
                    </div>
                    <span className="mt-4 block text-xs font-semibold uppercase tracking-wider text-pili-concrete transition-colors group-hover:text-pili-safety-deep">
                      Ver produto &rarr;
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Lead Form */}
      <section className="bg-pili-graphite py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-[length:var(--text-h2)] font-black uppercase text-pili-white">
            Quer um resultado como este?
          </h2>
          <p className="mt-2 text-center text-sm text-pili-cement">
            {caseData.client} &mdash; {caseData.application}. Preencha o
            formulario e nossa equipe entra em contato.
          </p>
          <div className="mt-8">
            <LeadForm
              productInterest={
                relatedProducts[0]?.name ?? caseData.application
              }
              source="CASE_STUDY"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
