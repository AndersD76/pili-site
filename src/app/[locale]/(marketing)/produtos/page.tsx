import { useTranslations } from "next-intl";
import { PRODUCTS } from "@/lib/data/products";
import { ProductCard } from "@/components/marketing/product-card";
import { Link } from "@/i18n/routing";
import { generatePageMetadata } from "@/lib/seo";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { ArrowRight } from "lucide-react";

export function generateMetadata() {
  return generatePageMetadata({
    title: "Produtos",
    description:
      "Tombadores hidraulicos de 9 a 30 metros, coletores de amostras e unidades de transbordo. Conheça a linha completa PILI Industrial.",
    path: "/produtos",
  });
}

const CATEGORIES = [
  { key: "TOMBADOR_FIXO", label: "Tombadores fixos", desc: "Plataformas de descarga fixas de 10 a 30 metros, com capacidade de 45 a 100 toneladas." },
  { key: "TOMBADOR_MOVEL", label: "Tombadores moveis", desc: "Plataformas de descarga sobre rodas para operacoes que exigem mobilidade e flexibilidade." },
  { key: "COLETOR_AMOSTRAS", label: "Coletores de amostras", desc: "Sistemas automatizados para coleta de amostras de graos durante a descarga." },
  { key: "UNIDADE_TRANSBORDO", label: "Unidades de transbordo", desc: "Equipamentos para transferencia de carga entre diferentes modais de transporte." },
  { key: "ESPECIAL", label: "Produtos especiais", desc: "Solucoes customizadas para aplicacoes industriais especificas." },
] as const;

export default function ProdutosPage() {
  const t = useTranslations();

  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="relative bg-pili-black py-24 px-6 lg:px-8">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute left-0 top-0 h-full w-1.5 bg-pili-safety" />
        <div className="relative mx-auto max-w-6xl">
          <span className="font-mono text-xs uppercase tracking-widest text-pili-safety">
            Linha completa
          </span>
          <h1 className="mt-3 font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            Produtos
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-px w-12 bg-pili-safety" />
            <p className="max-w-2xl text-pili-cement">
              Plataformas de descarga de 9 a 30 metros, coletores de amostras e
              equipamentos especiais. Todos fabricados em Erechim/RS com aco de
              alta resistencia.
            </p>
          </div>
          <div className="mt-8 flex gap-4">
            <Link
              href="/produtos/comparar"
              className="border border-pili-iron px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-pili-mist transition-colors hover:border-pili-safety hover:text-pili-white"
            >
              Comparar modelos
            </Link>
            <Link
              href="/catalogo"
              className="bg-pili-safety px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-pili-black transition-colors hover:bg-pili-safety-deep"
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
            <div key={cat.key} className="mb-20 last:mb-0">
              <AnimateOnScroll delay={catIndex * 0.05}>
                <div className="flex items-end justify-between border-b border-pili-mist pb-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold uppercase text-pili-black">
                      {cat.label}
                    </h2>
                    <p className="mt-1 text-sm text-pili-concrete">
                      {cat.desc}
                    </p>
                  </div>
                  <span className="hidden font-mono text-xs text-pili-cement sm:block">
                    {PRODUCTS.filter((p) => p.category === cat.key).length}{" "}
                    modelos
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
            Precisa de ajuda para escolher?
          </h2>
          <p className="mt-4 text-pili-cement">
            Use nossa calculadora de capacidade ou fale diretamente com a equipe
            tecnica da PILI para receber uma recomendacao personalizada.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/calculadora"
              className="inline-flex items-center gap-2 bg-pili-safety px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-black transition-colors hover:bg-pili-safety-deep"
            >
              Calculadora
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/orcamento"
              className="inline-flex items-center gap-2 border border-pili-white px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-white hover:text-pili-black"
            >
              Solicitar orcamento
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
