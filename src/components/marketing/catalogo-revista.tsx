"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ProdutoRevista } from "@/lib/catalogo-dados";

/**
 * Catálogo folheável, aberto depois do formulário de contato.
 *
 * Antes o formulário liberava só um link de download: quem preenchia esperava
 * o PDF baixar para então ver o catálogo, e nada daquele conteúdo era indexável
 * nem funcionava bem no celular. Aqui o catálogo abre na hora, no próprio site,
 * e o PDF continua a um clique para quem quiser levar.
 */

/** Duração da virada, em segundos. */
const VIRADA = 0.5;

interface Props {
  produtos: ProdutoRevista[];
  /** Endereço do PDF, oferecido dentro da revista. */
  pdfHref: string;
  aoFechar: () => void;
}

export function CatalogoRevista({ produtos, pdfHref, aoFechar }: Props) {
  const t = useTranslations();
  const semMovimento = useReducedMotion();

  // A capa é a página 0; cada produto ocupa uma página a partir da 1.
  const total = produtos.length + 1;
  const [pagina, setPagina] = useState(0);
  // +1 avançando, -1 voltando: define para que lado a folha gira.
  const [sentido, setSentido] = useState(1);

  const ir = useCallback(
    (destino: number) => {
      const alvo = Math.max(0, Math.min(total - 1, destino));
      if (alvo === pagina) return;
      setSentido(alvo > pagina ? 1 : -1);
      setPagina(alvo);
    },
    [pagina, total],
  );

  /* ---------- Teclado ---------- */
  useEffect(() => {
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "ArrowRight") ir(pagina + 1);
      else if (e.key === "ArrowLeft") ir(pagina - 1);
      else if (e.key === "Escape") aoFechar();
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [ir, pagina, aoFechar]);

  /* ---------- Trava o scroll do fundo ---------- */
  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = anterior;
    };
  }, []);

  /**
   * A folha gira em torno da borda interna, como papel preso na lombada.
   * Com `prefers-reduced-motion` a virada vira um fade simples.
   */
  const variantes = useMemo(
    () =>
      semMovimento
        ? {
            entra: { opacity: 0 },
            centro: { opacity: 1 },
            sai: { opacity: 0 },
          }
        : {
            entra: (dir: number) => ({
              rotateY: dir > 0 ? -95 : 95,
              opacity: 0,
              transformOrigin: dir > 0 ? "left center" : "right center",
            }),
            centro: {
              rotateY: 0,
              opacity: 1,
              transformOrigin: "center center",
            },
            sai: (dir: number) => ({
              rotateY: dir > 0 ? 95 : -95,
              opacity: 0,
              transformOrigin: dir > 0 ? "right center" : "left center",
            }),
          },
    [semMovimento],
  );

  const produto = pagina > 0 ? produtos[pagina - 1] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-pili-black/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t("catalogo.title")}
    >
      {/* -------- Barra superior -------- */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-pili-iron px-4 py-3 sm:px-6">
        <span className="font-mono text-xs uppercase tracking-widest text-pili-cement">
          {t("catalogo.title")}
        </span>

        <div className="flex items-center gap-2">
          <a
            href={pdfHref}
            className="inline-flex items-center gap-2 border border-pili-iron px-3 py-2 text-xs font-semibold uppercase tracking-wider text-pili-mist transition-colors hover:border-pili-safety hover:text-pili-white"
          >
            <Download className="size-4" />
            <span className="hidden sm:inline">{t("catalogo.pdf")}</span>
          </a>
          <button
            type="button"
            onClick={aoFechar}
            className="flex size-9 items-center justify-center rounded-full text-pili-cement transition-colors hover:bg-pili-steel hover:text-pili-white"
            aria-label={t("catalogo.fechar")}
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* -------- Página -------- */}
      <div
        className="relative flex-1 overflow-hidden px-4 py-5 sm:px-6"
        style={{ perspective: "2000px" }}
      >
        <AnimatePresence custom={sentido} initial={false} mode="wait">
          <motion.div
            key={pagina}
            custom={sentido}
            variants={variantes}
            initial="entra"
            animate="centro"
            exit="sai"
            transition={{ duration: semMovimento ? 0.2 : VIRADA, ease: "easeInOut" }}
            className="mx-auto h-full max-w-4xl overflow-y-auto bg-pili-white shadow-2xl"
            style={{ transformStyle: "preserve-3d" }}
            // Arrastar para o lado folheia, que é como se espera no celular.
            drag={semMovimento ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) ir(pagina + 1);
              else if (info.offset.x > 80) ir(pagina - 1);
            }}
          >
            {produto ? (
              <PaginaProduto produto={produto} numero={pagina} total={total - 1} />
            ) : (
              <Capa quantidade={produtos.length} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* -------- Navegação -------- */}
      <div className="flex shrink-0 items-center justify-center gap-4 border-t border-pili-iron px-4 py-3">
        <button
          type="button"
          onClick={() => ir(pagina - 1)}
          disabled={pagina === 0}
          className="flex size-10 items-center justify-center rounded-full border border-pili-iron text-pili-mist transition-colors hover:border-pili-safety hover:text-pili-white disabled:opacity-30 disabled:hover:border-pili-iron"
          aria-label={t("catalogo.anterior")}
        >
          <ChevronLeft className="size-5" />
        </button>

        <span className="min-w-24 text-center font-mono text-xs tabular-nums text-pili-cement">
          {pagina + 1} / {total}
        </span>

        <button
          type="button"
          onClick={() => ir(pagina + 1)}
          disabled={pagina === total - 1}
          className="flex size-10 items-center justify-center rounded-full border border-pili-iron text-pili-mist transition-colors hover:border-pili-safety hover:text-pili-white disabled:opacity-30 disabled:hover:border-pili-iron"
          aria-label={t("catalogo.proxima")}
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}

function Capa({ quantidade }: { quantidade: number }) {
  const t = useTranslations();
  return (
    <div className="flex h-full flex-col justify-center bg-pili-black px-8 py-16 text-center sm:px-16">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-pili-safety">
        {t("catalogo.eyebrow")}
      </span>
      <h2 className="mt-6 font-display text-4xl font-black uppercase leading-none tracking-tight text-pili-white sm:text-6xl">
        {t("catalogo.title")}
      </h2>
      <div className="mx-auto mt-6 h-1 w-20 bg-pili-safety" />
      <p className="mx-auto mt-6 max-w-md text-pili-cement">
        {t("catalogo.capaTexto", { quantidade })}
      </p>
    </div>
  );
}

function PaginaProduto({
  produto,
  numero,
  total,
}: {
  produto: ProdutoRevista;
  numero: number;
  total: number;
}) {
  const t = useTranslations();
  const capa = produto.imagens[0];

  return (
    <article className="flex h-full flex-col">
      {capa && (
        <div className="relative aspect-[16/9] w-full shrink-0 bg-pili-fog">
          <Image
            src={capa}
            alt={produto.name}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>
      )}

      <div className="flex-1 px-6 py-7 sm:px-10">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl font-black uppercase leading-tight tracking-tight text-pili-black sm:text-3xl">
            {produto.name}
          </h3>
          <span className="shrink-0 font-mono text-xs tabular-nums text-pili-cement">
            {numero}/{total}
          </span>
        </div>

        {produto.tagline && (
          <p className="mt-2 font-mono text-sm uppercase tracking-wide text-pili-safety">
            {produto.tagline}
          </p>
        )}

        {produto.description && (
          <p className="mt-5 leading-relaxed text-pili-iron">
            {produto.description}
          </p>
        )}

        {produto.specs.length > 0 && (
          <div className="mt-7">
            <h4 className="font-mono text-xs uppercase tracking-widest text-pili-cement">
              {t("catalogo.specs")}
            </h4>
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
              {produto.specs.map((s) => (
                <div key={s.key} className="border-t border-pili-mist pt-2">
                  <dt className="text-xs text-pili-concrete">{s.key}</dt>
                  <dd className="font-display font-bold tabular-nums text-pili-black">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {produto.features.length > 0 && (
          <ul className="mt-7 space-y-2">
            {produto.features.slice(0, 4).map((f) => (
              <li key={f.title} className="flex gap-3 text-sm leading-relaxed">
                <span className="mt-2 size-1.5 shrink-0 bg-pili-safety" />
                <span className="text-pili-iron">
                  <strong className="font-semibold text-pili-black">
                    {f.title}:
                  </strong>{" "}
                  {f.description}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
