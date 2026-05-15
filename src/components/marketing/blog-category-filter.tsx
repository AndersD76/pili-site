"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const CATEGORIES = [
  { key: "todos", label: "Todos" },
  { key: "noticia", label: "Notícias" },
  { key: "artigo", label: "Artigos" },
  { key: "evento", label: "Eventos" },
  { key: "lancamento", label: "Lançamentos" },
] as const;

export function BlogCategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("categoria") ?? "todos";

  const handleFilter = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (key === "todos") {
        params.delete("categoria");
      } else {
        params.set("categoria", key);
      }
      const qs = params.toString();
      router.push(qs ? `?${qs}` : "?", { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          onClick={() => handleFilter(cat.key)}
          className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
            active === cat.key
              ? "bg-pili-safety text-pili-white"
              : "border border-pili-mist text-pili-concrete hover:border-pili-black hover:text-pili-black"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
