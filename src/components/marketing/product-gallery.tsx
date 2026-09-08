"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface ImagemProduto {
  url: string;
  alt: string | null;
}

interface ProductGalleryProps {
  imagens: ImagemProduto[];
  /** Nome do produto: vira alt quando a mídia não tem texto alternativo. */
  nome: string;
  /** Usada quando o produto ainda não tem foto cadastrada. */
  imagemPadrao: string;
  textos: { ampliar: string; anterior: string; proxima: string; foto: string };
}

export function ProductGallery({
  imagens,
  nome,
  imagemPadrao,
  textos,
}: ProductGalleryProps) {
  const lista =
    imagens.length > 0 ? imagens : [{ url: imagemPadrao, alt: null }];
  const [atual, setAtual] = useState(0);
  const [ampliada, setAmpliada] = useState(false);

  const ir = useCallback(
    (passo: number) =>
      setAtual((i) => (i + passo + lista.length) % lista.length),
    [lista.length],
  );

  // Setas do teclado navegam a galeria ampliada.
  useEffect(() => {
    if (!ampliada) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") ir(1);
      if (e.key === "ArrowLeft") ir(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ampliada, ir]);

  const foto = lista[atual] ?? lista[0]!;
  const alt = foto.alt ?? nome;

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setAmpliada(true)}
        aria-label={textos.ampliar}
        className="group relative block aspect-4/3 w-full cursor-zoom-in overflow-hidden bg-pili-steel focus:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety focus-visible:ring-offset-2"
      >
        <Image
          src={foto.url}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute bottom-3 right-3 flex items-center gap-2 bg-pili-black/70 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-pili-white opacity-0 transition-opacity group-hover:opacity-100">
          <Maximize2 className="h-3.5 w-3.5" />
          {textos.ampliar}
        </span>
      </button>

      {lista.length > 1 && (
        <ul className="grid grid-cols-4 gap-3">
          {lista.map((img, i) => (
            <li key={img.url}>
              <button
                type="button"
                onClick={() => setAtual(i)}
                aria-label={`${textos.foto} ${i + 1}`}
                aria-current={i === atual}
                className={cn(
                  "relative block aspect-4/3 w-full overflow-hidden bg-pili-steel transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-pili-safety focus-visible:ring-offset-2",
                  i === atual
                    ? "ring-2 ring-pili-safety ring-offset-2"
                    : "opacity-70 hover:opacity-100",
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? nome}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={ampliada} onOpenChange={setAmpliada}>
        <DialogContent
          showCloseButton
          className="max-w-[min(96vw,1400px)] border-0 bg-pili-black p-0 sm:max-w-[min(96vw,1400px)] [&>button]:text-pili-white"
        >
          <DialogTitle className="sr-only">{nome}</DialogTitle>
          <div className="relative aspect-4/3 w-full">
            <Image
              src={foto.url}
              alt={alt}
              fill
              sizes="96vw"
              className="object-contain"
            />
          </div>

          {lista.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => ir(-1)}
                aria-label={textos.anterior}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-pili-black/60 p-3 text-pili-white transition-colors hover:bg-pili-safety"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => ir(1)}
                aria-label={textos.proxima}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-pili-black/60 p-3 text-pili-white transition-colors hover:bg-pili-safety"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-pili-black/70 px-3 py-1 font-mono text-xs text-pili-white">
                {atual + 1} / {lista.length}
              </span>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
