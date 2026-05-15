"use client";

import { useState } from "react";
import { PRODUCTS } from "@/lib/data/products";
import { Link } from "@/i18n/routing";
import { X, Plus } from "lucide-react";

const MAX_COMPARE = 4;

export default function CompararPage() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(slug: string) {
    setSelected((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : prev.length < MAX_COMPARE
          ? [...prev, slug]
          : prev
    );
  }

  const selectedProducts = PRODUCTS.filter((p) => selected.includes(p.slug));

  const allSpecKeys = [
    ...new Set(selectedProducts.flatMap((p) => p.specs.map((s) => s.label))),
  ];

  return (
    <main className="pt-[var(--header-height)]">
      <section className="bg-pili-black py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[length:var(--text-display-2)] font-black uppercase text-pili-white">
            Comparar produtos
          </h1>
          <p className="mt-4 text-pili-cement">
            Selecione ate {MAX_COMPARE} produtos para comparar lado a lado.
          </p>
        </div>
      </section>

      <section className="py-12 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Product selector */}
          <div className="flex flex-wrap gap-2">
            {PRODUCTS.map((p) => (
              <button
                key={p.slug}
                onClick={() => toggle(p.slug)}
                className={`border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  selected.includes(p.slug)
                    ? "border-pili-safety bg-pili-safety text-pili-white"
                    : "border-pili-mist text-pili-iron hover:border-pili-black"
                } ${
                  !selected.includes(p.slug) && selected.length >= MAX_COMPARE
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }`}
                disabled={
                  !selected.includes(p.slug) && selected.length >= MAX_COMPARE
                }
              >
                {selected.includes(p.slug) ? (
                  <span className="flex items-center gap-1">
                    {p.name} <X className="h-3 w-3" />
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Plus className="h-3 w-3" /> {p.name}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Comparison table */}
          {selectedProducts.length >= 2 && (
            <div className="mt-12 overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse">
                <thead>
                  <tr className="border-b border-pili-mist">
                    <th className="py-4 pr-6 text-left text-xs font-medium uppercase tracking-wider text-pili-cement">
                      Especificacao
                    </th>
                    {selectedProducts.map((p) => (
                      <th
                        key={p.slug}
                        className="py-4 px-4 text-left font-display text-base font-bold uppercase text-pili-black"
                      >
                        <Link
                          href={`/produtos/${p.slug}`}
                          className="hover:text-pili-safety-deep"
                        >
                          {p.name}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allSpecKeys.map((key) => (
                    <tr key={key} className="border-b border-pili-mist/50">
                      <td className="py-3 pr-6 text-xs font-medium uppercase tracking-wider text-pili-concrete">
                        {key}
                      </td>
                      {selectedProducts.map((p) => {
                        const spec = p.specs.find((s) => s.label === key);
                        return (
                          <td
                            key={p.slug}
                            className="py-3 px-4 font-mono text-sm text-pili-black"
                          >
                            {spec?.value ?? "-"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedProducts.length >= 2 && (
            <div className="mt-8">
              <Link
                href="/orcamento"
                className="bg-pili-safety px-8 py-3 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
              >
                Solicitar orcamento desta selecao
              </Link>
            </div>
          )}

          {selectedProducts.length < 2 && (
            <p className="mt-12 text-center text-pili-concrete">
              Selecione pelo menos 2 produtos para iniciar a comparacao.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
