"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from "pdfjs-dist";

/**
 * Catálogo folheável: as páginas do PDF viradas na tela.
 *
 * O desenho é o do arquivo, não uma remontagem em HTML — o PDF sai do mesmo
 * endereço que o botão de download usa e o pdf.js desenha cada página num
 * canvas. Assim a capa, a malha da ficha técnica e a tipografia do manual
 * chegam iguais ao que a pessoa levaria impresso.
 *
 * Em tela larga o catálogo abre como revista, com duas páginas por vez e a
 * folha girando pela lombada. No celular vai uma página por vez, virando pela
 * borda.
 */

/** Duração da virada, em segundos. */
const VIRADA_S = 0.62;

/** Páginas guardadas em memória. A 24ª desenhada descarta a mais antiga. */
const MAX_CACHE = 24;

/** Teto da resolução de desenho: acima disto o ganho não aparece na tela. */
const LARGURA_MAXIMA = 1400;

/**
 * Proporção do A4 (altura ÷ largura), usada enquanto a primeira página não
 * foi medida. Evita o salto de layout na abertura.
 */
const ASPECTO_A4 = 1.414;

interface Props {
  /** Endereço do PDF — o mesmo do botão de download. */
  pdfHref: string;
  aoFechar: () => void;
}

/** Páginas de cada vista: [esquerda, direita]. A capa vai sozinha à direita. */
function paginasDaVista(
  indice: number,
  duplo: boolean,
  total: number,
): [number | null, number | null] {
  if (total === 0) return [null, null];
  if (!duplo) {
    const n = indice + 1;
    return [null, n >= 1 && n <= total ? n : null];
  }
  if (indice <= 0) return [null, 1];
  const esquerda = indice * 2;
  const direita = esquerda + 1;
  return [
    esquerda <= total ? esquerda : null,
    direita <= total ? direita : null,
  ];
}

/** Quantas vistas o catálogo tem no modo atual. */
function totalDeVistas(duplo: boolean, total: number): number {
  if (total === 0) return 0;
  return duplo ? 1 + Math.ceil((total - 1) / 2) : total;
}

async function renderizarPagina(
  doc: PDFDocumentProxy,
  numero: number,
  larguraCss: number,
): Promise<string> {
  const pagina = await doc.getPage(numero);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const base = pagina.getViewport({ scale: 1 });
  const escala = (Math.min(larguraCss, LARGURA_MAXIMA) * dpr) / base.width;
  const viewport = pagina.getViewport({ scale: escala });

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  const contexto = canvas.getContext("2d", { alpha: false });
  if (!contexto) throw new Error("canvas indisponível");

  await pagina.render({ canvas, canvasContext: contexto, viewport }).promise;
  // JPEG em vez de PNG: são 23 páginas com foto, e o PNG encheria a memória
  // do celular sem diferença visível.
  const imagem = canvas.toDataURL("image/jpeg", 0.92);
  // Libera o bitmap antes do GC — o Safari do iPhone é sovina com canvas.
  canvas.width = 0;
  canvas.height = 0;
  pagina.cleanup();
  return imagem;
}

export function CatalogoFolheto({ pdfHref, aoFechar }: Props) {
  const t = useTranslations();
  const semMovimento = useReducedMotion();

  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [total, setTotal] = useState(0);
  const [aspecto, setAspecto] = useState(ASPECTO_A4);
  const [progresso, setProgresso] = useState(0);
  const [erro, setErro] = useState(false);

  const [indice, setIndice] = useState(0);
  const [duplo, setDuplo] = useState(false);
  const [area, setArea] = useState({ largura: 0, altura: 0 });
  const [imagens, setImagens] = useState<Record<string, string>>({});
  /** +1 virando para a frente, -1 voltando, null parado. */
  const [virando, setVirando] = useState<1 | -1 | null>(null);

  const areaRef = useRef<HTMLDivElement>(null);
  const imagensRef = useRef(imagens);
  useEffect(() => {
    imagensRef.current = imagens;
  }, [imagens]);

  /* ---------- Carrega o PDF ---------- */
  useEffect(() => {
    let vivo = true;
    // No pdf.js 6 quem libera worker e memória é a tarefa, não o documento.
    let tarefa: PDFDocumentLoadingTask | null = null;

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        // O worker sai do próprio domínio: a CSP do site aceita worker-src
        // apenas de 'self'.
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        tarefa = pdfjs.getDocument({ url: pdfHref });
        tarefa.onProgress = ({
          loaded,
          total: bytes,
        }: {
          loaded: number;
          total: number;
        }) => {
          if (vivo && bytes > 0) setProgresso(Math.min(1, loaded / bytes));
        };

        const documento = await tarefa.promise;
        if (!vivo) return;
        const primeira = await documento.getPage(1);
        const vista = primeira.getViewport({ scale: 1 });
        setAspecto(vista.height / vista.width);
        setTotal(documento.numPages);
        setDoc(documento);
      } catch (err) {
        console.error("[CATALOGO_FOLHETO]", err);
        if (vivo) setErro(true);
      }
    })();

    return () => {
      vivo = false;
      void tarefa?.destroy();
    };
  }, [pdfHref]);

  /* ---------- Mede a área e decide entre revista e página única ---------- */
  useEffect(() => {
    const elemento = areaRef.current;
    if (!elemento) return;
    const observador = new ResizeObserver(([entrada]) => {
      if (!entrada) return;
      const { width, height } = entrada.contentRect;
      setArea({ largura: width, altura: height });
      // Duas páginas só cabem quando a área é bem mais larga que alta;
      // no celular em pé isso deixaria cada página ilegível.
      setDuplo(width >= 900 && width / height >= 1.45);
    });
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  const larguraPagina = Math.max(
    0,
    Math.min(area.largura / (duplo ? 2 : 1), area.altura / aspecto),
  );
  const alturaPagina = larguraPagina * aspecto;
  // Quantizada: redimensionar a janela não pode disparar um desenho por pixel.
  const larguraDesenho = Math.round(larguraPagina / 40) * 40;

  const ultimaVista = Math.max(0, totalDeVistas(duplo, total) - 1);

  /* ---------- Troca de modo mantém a página que está à vista ---------- */
  const duploAnterior = useRef(duplo);
  useEffect(() => {
    if (duploAnterior.current === duplo) return;
    const [, direita] = paginasDaVista(indice, duploAnterior.current, total);
    const pagina = direita ?? 1;
    setIndice(duplo ? (pagina <= 1 ? 0 : Math.floor(pagina / 2)) : pagina - 1);
    duploAnterior.current = duplo;
  }, [duplo, indice, total]);

  /* ---------- Desenha as páginas à vista e as vizinhas ---------- */
  const necessarias = useMemo(() => {
    const lista: number[] = [];
    for (const i of [indice, indice + 1, indice - 1]) {
      for (const n of paginasDaVista(i, duplo, total)) {
        if (n && !lista.includes(n)) lista.push(n);
      }
    }
    return lista;
  }, [indice, duplo, total]);

  useEffect(() => {
    if (!doc || larguraDesenho <= 0) return;
    let vivo = true;

    (async () => {
      for (const numero of necessarias) {
        const chave = `${numero}@${larguraDesenho}`;
        if (imagensRef.current[chave]) continue;
        try {
          const imagem = await renderizarPagina(doc, numero, larguraDesenho);
          if (!vivo) return;
          setImagens((anterior) => {
            const novo = { ...anterior, [chave]: imagem };
            const chaves = Object.keys(novo);
            for (const velha of chaves.slice(0, chaves.length - MAX_CACHE)) {
              delete novo[velha];
            }
            return novo;
          });
        } catch (err) {
          console.error("[CATALOGO_FOLHETO] página", numero, err);
        }
      }
    })();

    return () => {
      vivo = false;
    };
  }, [doc, larguraDesenho, necessarias]);

  const imagemDe = useCallback(
    (numero: number | null) =>
      numero ? imagens[`${numero}@${larguraDesenho}`] : undefined,
    [imagens, larguraDesenho],
  );

  /* ---------- Navegação ---------- */
  const ir = useCallback(
    (sentido: 1 | -1) => {
      if (virando) return;
      const alvo = indice + sentido;
      if (alvo < 0 || alvo > ultimaVista) return;
      if (semMovimento) {
        setIndice(alvo);
        return;
      }
      setVirando(sentido);
    },
    [indice, ultimaVista, virando, semMovimento],
  );

  useEffect(() => {
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "ArrowRight") ir(1);
      else if (e.key === "ArrowLeft") ir(-1);
      else if (e.key === "Escape") aoFechar();
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [ir, aoFechar]);

  /* ---------- Trava o scroll do fundo ---------- */
  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = anterior;
    };
  }, []);

  /* ---------- Arrastar e clicar para folhear ---------- */
  const toqueX = useRef<number | null>(null);

  function aoSoltar(e: React.PointerEvent<HTMLDivElement>) {
    const inicio = toqueX.current;
    toqueX.current = null;
    if (inicio === null) return;
    const deslocamento = e.clientX - inicio;
    if (deslocamento < -60) return ir(1);
    if (deslocamento > 60) return ir(-1);
    // Toque parado: metade direita avança, metade esquerda volta.
    const caixa = e.currentTarget.getBoundingClientRect();
    ir(e.clientX > caixa.left + caixa.width / 2 ? 1 : -1);
  }

  const [esqAtual, dirAtual] = paginasDaVista(indice, duplo, total);
  const [esqProxima, dirProxima] = paginasDaVista(indice + 1, duplo, total);
  const [esqAnterior, dirAnterior] = paginasDaVista(indice - 1, duplo, total);

  // Embaixo da folha que gira fica o destino; o lado que a folha cobre
  // continua mostrando a página de onde ela saiu.
  const estatico =
    virando === 1
      ? { esq: duplo ? esqAtual : null, dir: dirProxima }
      : virando === -1
        ? { esq: esqAnterior, dir: duplo ? dirAtual : dirAnterior }
        : { esq: esqAtual, dir: dirAtual };

  // A folha tem frente e verso, como papel: de um lado a página que sai, do
  // outro a que entra.
  const folha =
    virando === 1
      ? { frente: dirAtual, verso: duplo ? esqProxima : dirProxima }
      : virando === -1
        ? { frente: duplo ? esqAtual : dirAtual, verso: dirAnterior }
        : null;

  const paginaVisivel = dirAtual ?? esqAtual ?? 1;
  const carregando = !doc && !erro;

  return (
    <div
      // Acima do aviso de cookies, que também é z-50 e esconderia a navegação.
      className="fixed inset-0 z-[60] flex flex-col bg-pili-black/95 backdrop-blur-sm"
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

      {/* -------- Páginas -------- */}
      <div
        ref={areaRef}
        className="relative flex-1 touch-pan-y select-none overflow-hidden px-3 py-4 sm:px-6"
        style={{ perspective: "2600px" }}
        onPointerDown={(e) => {
          toqueX.current = e.clientX;
        }}
        onPointerUp={aoSoltar}
      >
        {carregando && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2 className="size-7 animate-spin text-pili-safety" />
            <p className="font-mono text-xs uppercase tracking-widest text-pili-cement">
              {t("catalogo.carregando")}
            </p>
            {progresso > 0 && (
              <div className="h-0.5 w-40 bg-pili-steel">
                <div
                  className="h-full bg-pili-safety transition-[width]"
                  style={{ width: `${Math.round(progresso * 100)}%` }}
                />
              </div>
            )}
          </div>
        )}

        {erro && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="max-w-sm text-pili-mist">{t("catalogo.erroFolheto")}</p>
            <a
              href={pdfHref}
              className="inline-flex items-center gap-2 bg-pili-safety px-6 py-3 text-sm font-semibold uppercase tracking-wider text-pili-white transition-colors hover:bg-pili-safety-deep"
            >
              <Download className="size-4" />
              {t("catalogo.pdf")}
            </a>
          </div>
        )}

        {doc && larguraPagina > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative"
              style={{
                width: larguraPagina * (duplo ? 2 : 1),
                height: alturaPagina,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Páginas paradas */}
              <div className="absolute inset-0 flex">
                {/* No celular não existe lado esquerdo: ele roubaria metade da largura. */}
                {duplo && (
                  <Pagina
                    src={imagemDe(estatico.esq)}
                    largura={larguraPagina}
                    altura={alturaPagina}
                    // Com a capa sozinha à direita, o lado esquerdo fica vazio.
                    visivel={estatico.esq !== null}
                  />
                )}
                <Pagina
                  src={imagemDe(estatico.dir)}
                  largura={larguraPagina}
                  altura={alturaPagina}
                  visivel
                />
              </div>

              {/* Vinco da lombada */}
              {duplo && (
                <div
                  className="pointer-events-none absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 bg-gradient-to-r from-transparent via-pili-black/25 to-transparent"
                  aria-hidden
                />
              )}

              {/* Folha girando */}
              {folha && (
                <motion.div
                  className="absolute top-0"
                  style={{
                    left: duplo && virando === 1 ? larguraPagina : 0,
                    width: larguraPagina,
                    height: alturaPagina,
                    transformStyle: "preserve-3d",
                    transformOrigin:
                      virando === 1 ? "left center" : "right center",
                    zIndex: 10,
                  }}
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: virando === 1 ? -180 : 180 }}
                  transition={{ duration: VIRADA_S, ease: [0.3, 0, 0.2, 1] }}
                  onAnimationComplete={() => {
                    setIndice((i) => i + (virando ?? 0));
                    setVirando(null);
                  }}
                >
                  <Face src={imagemDe(folha.frente)} />
                  <Face src={imagemDe(folha.verso)} verso />
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* -------- Navegação -------- */}
      <div className="flex shrink-0 items-center justify-center gap-4 border-t border-pili-iron px-4 py-3">
        <button
          type="button"
          onClick={() => ir(-1)}
          disabled={indice === 0 || !doc}
          className="flex size-10 items-center justify-center rounded-full border border-pili-iron text-pili-mist transition-colors hover:border-pili-safety hover:text-pili-white disabled:opacity-30 disabled:hover:border-pili-iron"
          aria-label={t("catalogo.anterior")}
        >
          <ChevronLeft className="size-5" />
        </button>

        <span className="min-w-24 text-center font-mono text-xs tabular-nums text-pili-cement">
          {total > 0 ? `${paginaVisivel} / ${total}` : "—"}
        </span>

        <button
          type="button"
          onClick={() => ir(1)}
          disabled={indice >= ultimaVista || !doc}
          className="flex size-10 items-center justify-center rounded-full border border-pili-iron text-pili-mist transition-colors hover:border-pili-safety hover:text-pili-white disabled:opacity-30 disabled:hover:border-pili-iron"
          aria-label={t("catalogo.proxima")}
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}

/** Uma página parada, com o lugar reservado enquanto o desenho não chega. */
function Pagina({
  src,
  largura,
  altura,
  visivel,
}: {
  src: string | undefined;
  largura: number;
  altura: number;
  visivel: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden ${visivel ? "bg-pili-white shadow-2xl" : ""}`}
      style={{ width: largura, height: altura }}
    >
      {visivel && src && (
        // Desenho do pdf.js em data URI: o next/image não tem o que otimizar.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-contain" />
      )}
      {visivel && !src && (
        <div className="flex size-full items-center justify-center">
          <Loader2 className="size-6 animate-spin text-pili-mist" />
        </div>
      )}
    </div>
  );
}

/** Frente ou verso da folha que gira. */
function Face({ src, verso = false }: { src?: string; verso?: boolean }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-pili-white shadow-2xl"
      style={{
        backfaceVisibility: "hidden",
        transform: verso ? "rotateY(180deg)" : undefined,
      }}
    >
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-contain" />
      )}
    </div>
  );
}
