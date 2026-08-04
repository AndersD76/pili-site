import { notFound } from "next/navigation";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Link } from "@/i18n/routing";
import { getObra, getObras, getProduto } from "@/lib/content";
import { LeadForm } from "@/components/marketing/lead-form";
import { generatePageMetadata, generateBreadcrumbJsonLd, jsonLdScript} from "@/lib/seo";

/**
 * O conteúdo vem do banco e muda pelo painel. Com ISR a página é servida do
 * cache e revalidada em segundo plano — as edições aparecem sem redeploy, e a
 * primeira visita não paga a consulta.
 */
export const revalidate = 300;

export async function generateStaticParams() {
  const obras = await getObras();
  return obras.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const caseData = await getObra(slug);
  if (!caseData) return {};
  return generatePageMetadata({
    locale,
    title: caseData.title,
    description: caseData.summary,
    path: `/obras/${caseData.slug}`,
    image: caseData.image,
  });
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const caseData = await getObra(slug);
  if (!caseData) notFound();

  // `caseData.products` fica vazio enquanto o schema não modelar a relação
  // obra→produto; o `Promise.all` já deixa o caminho pronto para quando existir.
  const relatedProducts = (
    await Promise.all(caseData.products.map((pSlug) => getProduto(pSlug)))
  ).filter((p) => p !== null);

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
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-pili-mist bg-pili-paper px-6 py-3 lg:px-8">
        <Breadcrumbs
          className="mx-auto max-w-6xl"
          items={[
            { name: t("common.home"), href: "/" },
            { name: t("nav.projects"), href: "/obras" },
            { name: caseData.title },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="bg-pili-paper pb-16 pt-8 px-6 lg:px-8">
      {/* Galeria — a primeira foto é a principal, definida no painel */}
      <div className="mx-auto mb-12 max-w-6xl px-6 lg:px-8">
        <div className="relative aspect-16/9 overflow-hidden bg-pili-steel">
          <Image
            src={caseData.image}
            alt={caseData.images[0]?.alt ?? caseData.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1152px"
            className="object-cover"
          />
        </div>
        {caseData.images.length > 1 && (
          <ul className="mt-3 grid grid-cols-4 gap-3">
            {caseData.images.slice(1, 5).map((img) => (
              <li key={img.url} className="relative aspect-4/3 overflow-hidden bg-pili-steel">
                <Image
                  src={img.url}
                  alt={img.alt ?? caseData.title}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        )}
      </div>

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
            formulário e nossa equipe entra em contato.
          </p>
          <div className="mt-8">
            <LeadForm
              dark
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
