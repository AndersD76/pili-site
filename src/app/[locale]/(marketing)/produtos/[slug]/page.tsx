import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getProduct, PRODUCTS } from "@/lib/data/products";
import { CASES } from "@/lib/data/cases";
import { SpecTable } from "@/components/marketing/spec-table";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { LeadForm } from "@/components/marketing/lead-form";
import { ProductCard } from "@/components/marketing/product-card";
import { generatePageMetadata, generateProductJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return generatePageMetadata({
    title: product.name,
    description: product.tagline,
    path: `/produtos/${product.slug}`,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
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
    image: "/images/og-default.jpg",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
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
          <Link href="/produtos" className="hover:text-pili-black">
            Produtos
          </Link>{" "}
          / <span className="text-pili-black">{product.name}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-pili-paper pb-16 pt-8 px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          {/* Image placeholder */}
          <div className="aspect-[4/3] bg-pili-steel" />

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
                Solicitar orçamento
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
              Aplicações
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
              Casos de uso
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

      {/* Lead form */}
      <section className="bg-pili-graphite py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-[length:var(--text-h2)] font-black uppercase text-pili-white">
            Solicitar orçamento
          </h2>
          <p className="mt-2 text-center text-sm text-pili-cement">
            {product.name} — preencha o formulário e nossa equipe entra em contato
          </p>
          <div className="mt-8">
            <LeadForm productInterest={product.name} source="FORMULARIO" />
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
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
