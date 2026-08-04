"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useTranslations } from "next-intl";

const CATEGORIES = ["todos", "noticia", "artigo", "evento", "lancamento"] as const;

export function BlogCategoryFilter() {
  const t = useTranslations("blog.categories");
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
          key={cat}
          onClick={() => handleFilter(cat)}
          className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
            active === cat
              ? "bg-pili-safety text-pili-white"
              : "border border-pili-mist text-pili-concrete hover:border-pili-black hover:text-pili-black"
          }`}
        >
          {t(cat)}
        </button>
      ))}
    </div>
  );
}
