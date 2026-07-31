import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";

export interface Crumb {
  name: string;
  /** Caminho sem prefixo de locale. Ausente no item atual. */
  href?: string;
}

/**
 * Trilha de navegação visível.
 *
 * O `BreadcrumbList` em JSON-LD já era emitido, mas sem contrapartida na página.
 * O Google orienta que o marcador reflita uma navegação existente; além do rich
 * result, a trilha distribui autoridade para as páginas intermediárias.
 */
export function Breadcrumbs({
  items,
  className = "",
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Trilha de navegação" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  className="size-3.5 shrink-0 text-pili-concrete"
                  aria-hidden="true"
                />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-pili-concrete transition-colors hover:text-pili-black hover:underline"
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className="font-medium text-pili-black"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
