import { useTranslations } from "next-intl";
import { PRODUCTS } from "@/lib/data/products";
import { ProductCard } from "@/components/marketing/product-card";
import { Link } from "@/i18n/routing";
import { generatePageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return generatePageMetadata({
    title: "Produtos",
    description:
      "Tombadores hidraulicos de 9 a 30 metros, coletores de amostras e unidades de transbordo. Conheça a linha completa PILI Industrial.",
    path: "/produtos",
  });
}

const CATEGORIES = [
  { key: "TOMBADOR_FIXO", label: "Tombadores fixos" },
  { key: "TOMBADOR_MOVEL", label: "Tombadores moveis" },
  { key: "COLETOR_AMOSTRAS", label: "Coletores de amostras" },
  { key: "UNIDADE_TRANSBORDO", label: "Unidades de transbordo" },
  { key: "ESPECIAL", label: "Produtos especiais" },
] as const;

export default function ProdutosPage() {
  const t = useTranslations();

  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            Produtos
          </h1>
          <p className="mt-4 max-w-2xl text-pili-cement">
            Plataformas de descarga de 9 a 30 metros, coletores de amostras e
            equipamentos especiais. Todos fabricados em Erechim/RS com aco de
            alta resistencia.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/produtos/comparar"
              className="border border-pili-iron px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-pili-mist transition-colors hover:bg-pili-steel"
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

      {/* Product grid */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {CATEGORIES.filter((cat) =>
            PRODUCTS.some((p) => p.category === cat.key)
          ).map((cat) => (
            <div key={cat.key} className="mb-16 last:mb-0">
              <h2 className="font-display text-xl font-bold uppercase text-pili-black">
                {cat.label}
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {PRODUCTS.filter((p) => p.category === cat.key).map(
                  (product) => (
                    <ProductCard
                      key={product.slug}
                      name={product.name}
                      slug={product.slug}
                      category={product.category}
                      capacity={product.capacity}
                      length={product.length}
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
