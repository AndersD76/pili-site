import { notFound } from "next/navigation";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Link } from "@/i18n/routing";
import { getProduto, getProdutos, getObras } from "@/lib/content";
import { SpecTable } from "@/components/marketing/spec-table";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { LeadForm } from "@/components/marketing/lead-form";
import { ProductCard } from "@/components/marketing/product-card";
import {
  generatePageMetadata,
  generateProductJsonLd,
  generateBreadcrumbJsonLd,
  generateFaqJsonLd,
  jsonLdScript,
} from "@/lib/seo";

/**
 * O conteúdo vem do banco e muda pelo painel. Com ISR a página é servida do
 * cache e revalidada em segundo plano — as edições aparecem sem redeploy, e a
 * primeira visita não paga a consulta.
 */
export const revalidate = 300;

export async function generateStaticParams() {
  const produtos = await getProdutos();
  return produtos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await getProduto(slug);
  if (!product) return {};
  return generatePageMetadata({
    locale,
    title: product.metaTitle ?? product.name,
    description: product.metaDesc ?? product.tagline,
    path: `/produtos/${product.slug}`,
    image: product.image,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  const CASES = await getObras();
  const PRODUCTS = await getProdutos();
  const product = await getProduto(slug);
  if (!product) notFound();

  const relatedCases = CASES.filter((c) =>
    c.products.includes(product.slug)
  );
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  ).slice(0, 3);

  const productJsonLd = generateProductJsonLd({
    name: product.name,
    description: product.description,
    image: product.image,
    slug: product.slug,
    category: product.category,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Produtos", url: "/pt-BR/produtos" },
    { name: product.name, url: `/pt-BR/produtos/${product.slug}` },
  ]);

  return (
    <main className="pt-[var(--header-height)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }}
      />
      {product.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(generateFaqJsonLd(product.faqs)),
          }}
        />
      )}

      {/* Breadcrumb */}
      <div className="border-b border-pili-mist bg-pili-paper px-6 py-3 lg:px-8">
        <Breadcrumbs
          className="mx-auto max-w-6xl"
          items={[
            { name: t("common.home"), href: "/" },
            { name: t("nav.products"), href: "/produtos" },
            { name: product.name },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="bg-pili-paper pb-16 pt-8 px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          {/* Galeria — a primeira foto é a principal, definida no painel */}
          <div className="space-y-3">
            <div className="relative aspect-4/3 overflow-hidden bg-pili-steel">
              <Image
                src={product.image}
                alt={product.images[0]?.alt ?? product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <ul className="grid grid-cols-4 gap-3">
                {product.images.slice(1, 5).map((img) => (
                  <li
                    key={img.url}
                    className="relative aspect-4/3 overflow-hidden bg-pili-steel"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt ?? product.name}
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <span className="font-mono text-xs uppercase tracking-wider text-pili-cement">
              {product.category.replace(/_/g, " ")}
            </span>
            <h1 className="mt-2 font-display text-[length:var(--text-h1)] font-black uppercase text-pili-black">
              {product.name}
            </h1>
            <p className="mt-2 text-lg text-pili-concrete">{product.tagline}</p>
            <p className="mt-4 leading-relaxed text-pili-iron">
              {product.description}
            </p>

            <div className="mt-8">
              <SpecTable specs={product.specs} />
            </div>

            <div className="mt-8 flex gap-4">
              <Link
                href="/orcamento"
                className="bg-pili-safety px-6 py-3 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
              >
                {t("common.requestQuote")}
              </Link>
              <Link
                href="/produtos/comparar"
                className="border border-pili-black px-6 py-3 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors hover:bg-pili-black hover:text-pili-paper"
              >
                Comparar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      {product.features.length > 0 && (
        <section className="py-16 px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              Diferenciais
            </h2>
            <div className="mt-8">
              <FeatureGrid features={product.features} />
            </div>
          </div>
        </section>
      )}

      {/* Applications */}
      {product.applications.length > 0 && (
        <section className="bg-pili-paper py-16 px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              {t("produtos.applications")}
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {product.applications.map((app) => (
                <Link
                  key={app}
                  href={`/solucoes/${app}`}
                  className="border border-pili-mist px-4 py-2 font-mono text-sm capitalize text-pili-iron transition-colors hover:border-pili-black hover:text-pili-black"
                >
                  {app}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related cases */}
      {relatedCases.length > 0 && (
        <section className="py-16 px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              {t("produtos.useCases")}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {relatedCases.map((c) => (
                <Link
                  key={c.slug}
                  href={`/obras/${c.slug}`}
                  className="border border-pili-mist p-6 transition-all hover:border-pili-black"
                >
                  <span className="font-mono text-xs uppercase tracking-wider text-pili-cement">
                    {c.client} &middot; {c.location}
                  </span>
                  <h3 className="mt-1 font-display text-lg font-bold uppercase text-pili-black">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm text-pili-concrete line-clamp-2">
                    {c.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ — as perguntas precisam estar visíveis para o rich result valer */}
      {product.faqs.length > 0 && (
        <section className="bg-pili-paper py-16 px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              {t("produtos.faq")}
            </h2>
            <dl className="mt-8 divide-y divide-pili-mist border-y border-pili-mist">
              {product.faqs.map((faq) => (
                <div key={faq.question} className="py-6">
                  <dt className="font-display text-base font-bold text-pili-black">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 leading-relaxed text-pili-concrete">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Lead form */}
      <section className="bg-pili-graphite py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-[length:var(--text-h2)] font-black uppercase text-pili-white">
            {t("common.requestQuote")}
          </h2>
          <p className="mt-2 text-center text-sm text-pili-cement">
            {t("orcamento.subtitle", { product: product.name })}
          </p>
          <div className="mt-8">
            <LeadForm dark productInterest={product.name} source="FORMULARIO" />
          </div>
        </div>
      </section>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-black">
              Produtos relacionados
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.slug}
                  name={p.name}
                  slug={p.slug}
                  category={p.category}
                  capacity={p.capacity}
                  length={p.length}
                        image={p.image}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
