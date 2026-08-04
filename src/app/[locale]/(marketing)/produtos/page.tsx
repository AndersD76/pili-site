import { setRequestLocale, getTranslations } from "next-intl/server";
import { getProdutos } from "@/lib/content";
import { ProductCard } from "@/components/marketing/product-card";
import { Link } from "@/i18n/routing";
import { generatePageMetadata } from "@/lib/seo";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { ArrowRight } from "lucide-react";

/**
 * O conteúdo vem do banco e muda pelo painel. Com ISR a página é servida do
 * cache e revalidada em segundo plano — as edições aparecem sem redeploy, e a
 * primeira visita não paga a consulta.
 */
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "produtos" });
  return generatePageMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDesc"),
    path: "/produtos",
  });
}

const CATEGORIES = [
  { key: "TOMBADOR_FIXO", i18n: "tombadorFixo" },
  { key: "TOMBADOR_MOVEL", i18n: "tombadorMovel" },
  { key: "COLETOR_AMOSTRAS", i18n: "coletor" },
  { key: "UNIDADE_TRANSBORDO", i18n: "transbordo" },
  { key: "ESPECIAL", i18n: "especial" },
] as const;

export default async function ProdutosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const PRODUCTS = await getProdutos();

  const t = await getTranslations();

  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="relative bg-pili-black py-24 px-6 lg:px-8">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute left-0 top-0 h-full w-1.5 bg-pili-safety" />
        <div className="relative mx-auto max-w-6xl">
          <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
            {t("produtos.eyebrow")}
          </span>
          <h1 className="mt-3 font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            {t("nav.products")}
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-px w-12 bg-pili-safety" />
            <p className="max-w-2xl text-pili-cement">
              {t("produtos.intro")}
            </p>
          </div>
          <div className="mt-8 flex gap-4">
            <Link
              href="/produtos/comparar"
              className="border border-pili-iron px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-pili-mist transition-colors hover:border-pili-safety hover:text-pili-white"
            >
              {t("footer.links.comparar")}
            </Link>
            <Link
              href="/catalogo"
              className="bg-pili-safety px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
            >
              {t("common.download_catalog")}
            </Link>
          </div>
        </div>
      </section>

      {/* Product grid by category */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {CATEGORIES.filter((cat) =>
            PRODUCTS.some((p) => p.category === cat.key)
          ).map((cat, catIndex) => (
            <div
              key={cat.key}
              id={cat.key.toLowerCase().replace(/_/g, "-")}
              className="mb-20 scroll-mt-[var(--header-height)] last:mb-0"
            >
              <AnimateOnScroll delay={catIndex * 0.05}>
                <div className="flex items-end justify-between border-b border-pili-mist pb-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold uppercase text-pili-black">
                      {t(`produtos.categories.${cat.i18n}`)}
                    </h2>
                    <p className="mt-1 text-sm text-pili-concrete">
                      {t(`produtos.categoryDesc.${cat.i18n}`)}
                    </p>
                  </div>
                  <span className="hidden font-mono text-xs text-pili-cement sm:block">
                    {PRODUCTS.filter((p) => p.category === cat.key).length}{" "}
                    {t("produtos.models")}
                  </span>
                </div>
              </AnimateOnScroll>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {PRODUCTS.filter((p) => p.category === cat.key).map(
                  (product, i) => (
                    <AnimateOnScroll key={product.slug} delay={i * 0.08}>
                      <ProductCard
                        name={product.name}
                        slug={product.slug}
                        category={product.category}
                        capacity={product.capacity}
                        length={product.length}
                        image={product.image}
                      />
                    </AnimateOnScroll>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-pili-black py-20 px-6 lg:px-8 stripe-pattern">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-[length:var(--text-h2)] font-black uppercase text-pili-white">
            {t("produtos.helpTitle")}
          </h2>
          <p className="mt-4 text-pili-cement">
            {t("produtos.helpText")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/calculadora"
              className="inline-flex items-center gap-2 bg-pili-safety px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
            >
              {t("produtos.calculator")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/orcamento"
              className="inline-flex items-center gap-2 border border-pili-white px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-white hover:text-pili-black"
            >
              {t("common.requestQuote")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
