"use client";

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { X, Box } from "lucide-react";

/**
 * Visualizador 3D do equipamento — mesma engine do portal (online-3d-viewer).
 *
 * Antes o site usava `<model-viewer>`, que exigia acertar a rotação do modelo
 * na mão (o tombador abria deitado e o conserto era um RotX +90 fixo). A
 * engine do portal deduz o eixo vertical pela geometria e ainda dá botões de
 * girar, zoom, encaixar e trocar o eixo quando a heurística erra.
 *
 * O bundle é servido de public/vendor, como já era feito com o model-viewer:
 * assim o pacote não entra no build do site.
 */
const SCRIPT_SRC = "/vendor/o3dv-0.18.0.min.js";

/**
 * O .glb tem ~6 MB e a engine ainda precisa interpretar a malha depois de
 * baixar. 45 s cobre 3G ruim com folga; passou disso, algo quebrou.
 */
const TEMPO_LIMITE_MS = 45_000;

function carregarScript(): Promise<void> {
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Falha ao carregar o visualizador 3D"));
    document.head.appendChild(s);
  });
}

type Eixo = "X" | "Y" | "Z";

/**
 * Orienta o modelo pela GEOMETRIA, não pelo que o CAD exportou.
 *
 * O EmbeddedViewer força "Y para cima" depois de carregar, e o que sai do
 * SolidWorks vem com Z para cima — o tombador aparecia em pé.
 *
 * O equipamento é uma plataforma: COMPRIDO (o trilho), de largura média e
 * BAIXO. Logo o eixo vertical é o de menor extensão — mas só entre os dois que
 * não são o comprimento. Pegar o menor dos três direto deitava a peça, porque
 * o tombador é comprido e estreito.
 */
/* eslint-disable @typescript-eslint/no-explicit-any -- a lib não tem tipos aqui */
function orientarModelo(OV: any, embedded: any, eixoForcado?: Eixo): Eixo {
  const v = embedded.GetViewer();
  let eixo: Eixo = eixoForcado ?? "Z";

  if (!eixoForcado) {
    try {
      const box = v.GetBoundingBox(() => true);
      if (box?.min && box?.max) {
        const ext: Record<Eixo, number> = {
          X: Math.abs(box.max.x - box.min.x),
          Y: Math.abs(box.max.y - box.min.y),
          Z: Math.abs(box.max.z - box.min.z),
        };
        const eixos: Eixo[] = ["Z", "Y", "X"];
        const maior = Math.max(ext.X, ext.Y, ext.Z);
        const menor = Math.min(ext.X, ext.Y, ext.Z);
        // Peça sem eixo dominante (quase cúbica): não há o que deduzir.
        if (maior - menor >= maior * 0.05) {
          const comprimento = eixos.reduce(
            (m, e) => (ext[e] > ext[m] + 1e-6 ? e : m),
            "Z" as Eixo,
          );
          // Entre os outros dois, o menor é a altura. Empate favorece Z.
          const restantes = eixos.filter((e) => e !== comprimento);
          eixo = restantes.reduce(
            (m, e) => (ext[e] < ext[m] - 1e-6 ? e : m),
            restantes.includes("Z") ? "Z" : (restantes[0] as Eixo),
          );
        }
      }
    } catch {
      /* fica Z */
    }
  }

  const dir =
    eixo === "X" ? OV.Direction.X : eixo === "Y" ? OV.Direction.Y : OV.Direction.Z;
  // Câmera isométrica relativa ao eixo escolhido.
  const cam =
    eixo === "Y"
      ? new OV.Camera(
          new OV.Coord3D(-1.5, 2.0, 3.0),
          new OV.Coord3D(0, 0, 0),
          new OV.Coord3D(0, 1, 0),
          45,
        )
      : new OV.Camera(
          new OV.Coord3D(2.0, -3.0, 1.5),
          new OV.Coord3D(0, 0, 0),
          eixo === "X" ? new OV.Coord3D(1, 0, 0) : new OV.Coord3D(0, 0, 1),
          45,
        );

  try {
    v.SetCamera(cam);
  } catch {
    /* noop */
  }
  try {
    v.SetUpVector(dir, false);
  } catch {
    /* noop */
  }
  // Órbita livre: gira 360° em todos os sentidos, sem trava nos polos.
  try {
    v.SetNavigationMode(OV.NavigationMode.FreeOrbit);
  } catch {
    /* noop */
  }
  try {
    const esfera = v.GetBoundingSphere(() => true);
    if (esfera) v.FitSphereToWindow(esfera, false);
  } catch {
    /* noop */
  }
  return eixo;
}

export interface InfoCard3D {
  valor: string;
  label: string;
  destaque?: boolean;
}

interface Modelo3DModalProps {
  src: string;
  bgImage?: string;
  alt?: string;
  titulo?: string;
  subtitulo?: string;
  cards?: InfoCard3D[];
}

const MODAL_STYLES = `
  .mv-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: blur(20px) brightness(0.15);
    transform: scale(1.1);
  }
  @keyframes card-in {
    0% { opacity: 0; transform: translateY(16px) scale(0.92); }
    60% { opacity: 1; transform: translateY(-3px) scale(1.01); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes card-glow {
    0%, 100% { box-shadow: 0 0 0 rgba(227,30,36,0); }
    50% { box-shadow: 0 0 16px rgba(227,30,36,0.18); }
  }
  @keyframes valor-pop {
    0% { opacity: 0; transform: scale(0.5); }
    50% { transform: scale(1.12); }
    100% { opacity: 1; transform: scale(1); }
  }
  .info-card {
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 10px 14px;
    opacity: 0;
    animation: card-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .info-card--destaque {
    border-color: rgba(227,30,36,0.35);
    animation: card-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards,
               card-glow 3s ease-in-out 1.5s infinite;
  }
  .info-card__valor {
    font-family: var(--font-display), system-ui, sans-serif;
    font-size: 18px; font-weight: 800;
    color: #fff;
    letter-spacing: -0.02em;
    opacity: 0;
    animation: valor-pop 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .info-card__valor--destaque { color: #E31E24; }
  .info-card__label {
    font-size: 9px; font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.45);
    margin-top: 1px;
    font-family: var(--font-mono), monospace;
  }
  @keyframes titulo-slide {
    0% { opacity: 0; transform: translateX(-20px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  @keyframes linha-grow { 0% { width: 0; } 100% { width: 40px; } }
  @keyframes dialog-in {
    0% { opacity: 0; transform: scale(0.95) translateY(10px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  .mv-titulo { opacity: 0; animation: titulo-slide 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s forwards; }
  .mv-linha { height: 2px; width: 0; background: #E31E24; animation: linha-grow 0.4s ease 0.4s forwards; }
  .mv-sub { opacity: 0; animation: titulo-slide 0.6s cubic-bezier(0.16,1,0.3,1) 0.35s forwards; }
  .mv-dialog { animation: dialog-in 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
`;

function Seta({ d }: { d: string }) {
  return (
    <svg
      className="size-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    </svg>
  );
}

function BotaoViewer({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/20 active:scale-95"
    >
      {children}
    </button>
  );
}

export function Modelo3DModal({
  src,
  bgImage,
  alt = "Modelo 3D do equipamento",
  titulo,
  subtitulo,
  cards = [],
}: Modelo3DModalProps) {
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [dica, setDica] = useState(true);
  const [eixo, setEixo] = useState<Eixo | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const ovRef = useRef<any>(null);
  const viewerRef = useRef<any>(null);
  const camInicialRef = useRef<any>(null);

  const abrir = useCallback(() => {
    setCarregando(true);
    setErro(null);
    setDica(true);
    setAberto(true);
  }, []);
  const fechar = useCallback(() => setAberto(false), []);

  useEffect(() => {
    if (!aberto) return;

    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") fechar();
    }
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [aberto, fechar]);

  useEffect(() => {
    if (!aberto) return;

    let cancelado = false;
    let viewer: any = null;
    let tempoLimite: ReturnType<typeof setTimeout> | undefined;

    (async () => {
      try {
        await carregarScript();
        const OV = (window as any).OV;
        if (!OV) throw new Error("Visualizador 3D indisponível");
        ovRef.current = OV;

        const resp = await fetch(src);
        if (!resp.ok) throw new Error("Falha ao baixar o modelo");
        const blob = await resp.blob();
        const arquivo = new File([blob], src.split("/").pop() ?? "modelo.glb", {
          type: blob.type,
        });

        if (cancelado || !containerRef.current) return;

        // `onModelLoaded` e o unico ponto que desliga o spinner. Quando a
        // engine falha em interpretar o .glb ela nao chama callback nenhum nem
        // lanca erro, e o "Carregando modelo 3D..." fica girando indefinidamente.
        // Este limite transforma esse silencio numa mensagem acionavel.
        tempoLimite = setTimeout(() => {
          if (cancelado) return;
          setCarregando((aindaCarregando) => {
            if (aindaCarregando) {
              setErro("O modelo demorou demais para abrir. Recarregue a pagina.");
            }
            return false;
          });
        }, TEMPO_LIMITE_MS);

        viewer = new OV.EmbeddedViewer(containerRef.current, {
          backgroundColor: new OV.RGBAColor(11, 11, 12, 255),
          defaultColor: new OV.RGBColor(212, 212, 212),
          onModelLoaded: () => {
            if (cancelado) return;
            clearTimeout(tempoLimite);
            setCarregando(false);
            try {
              setEixo(orientarModelo(OV, viewer));
            } catch {
              /* noop */
            }
            // Guarda a vista que encaixa o modelo, para o botão "Encaixar".
            try {
              const c = viewer.GetViewer().GetCamera();
              camInicialRef.current = new OV.Camera(
                c.eye.Clone(),
                c.center.Clone(),
                c.up.Clone(),
                c.fov,
              );
            } catch {
              /* noop */
            }
          },
        });
        viewerRef.current = viewer;
        viewer.LoadModelFromFileList([arquivo]);
      } catch (e) {
        if (!cancelado) {
          clearTimeout(tempoLimite);
          setErro(e instanceof Error ? e.message : "Erro ao carregar o 3D");
          setCarregando(false);
        }
      }
    })();

    return () => {
      cancelado = true;
      clearTimeout(tempoLimite);
      try {
        viewer?.Destroy?.();
      } catch {
        /* noop */
      }
      viewerRef.current = null;
    };
  }, [aberto, src]);

  /** Gira orbitando a câmera ao redor do centro do modelo. */
  const orbitar = useCallback((horiz: number, vert: number) => {
    const OV = ovRef.current;
    const ev = viewerRef.current;
    if (!OV || !ev) return;
    try {
      const v = ev.GetViewer();
      const cam = v.GetCamera();
      const passo = 0.26; // ~15°
      if (horiz) cam.eye.Rotate(cam.up, horiz * passo, cam.center);
      if (vert) {
        const dir = OV.SubCoord3D(cam.center, cam.eye);
        const direita = OV.CrossVector3D(dir, cam.up).Normalize();
        cam.eye.Rotate(direita, vert * passo, cam.center);
        cam.up.Rotate(direita, vert * passo, new OV.Coord3D(0, 0, 0));
      }
      v.SetCamera(cam);
      setDica(false);
    } catch {
      /* noop */
    }
  }, []);

  const aproximar = useCallback((fator: number) => {
    const OV = ovRef.current;
    const ev = viewerRef.current;
    if (!OV || !ev) return;
    try {
      const v = ev.GetViewer();
      const cam = v.GetCamera();
      const dir = OV.SubCoord3D(cam.eye, cam.center);
      dir.MultiplyScalar(fator);
      cam.eye = OV.AddCoord3D(cam.center, dir);
      v.SetCamera(cam);
    } catch {
      /* noop */
    }
  }, []);

  const encaixar = useCallback(() => {
    const OV = ovRef.current;
    const ev = viewerRef.current;
    const inicial = camInicialRef.current;
    if (!OV || !ev || !inicial) return;
    try {
      ev.GetViewer().SetCamera(
        new OV.Camera(
          inicial.eye.Clone(),
          inicial.center.Clone(),
          inicial.up.Clone(),
          inicial.fov,
        ),
      );
    } catch {
      /* noop */
    }
  }, []);

  /** Se a heurística errar, o visitante troca o eixo vertical: Z → Y → X. */
  const trocarEixo = useCallback(() => {
    const OV = ovRef.current;
    const ev = viewerRef.current;
    if (!OV || !ev) return;
    const ordem: Eixo[] = ["Z", "Y", "X"];
    const proximo = ordem[(ordem.indexOf(eixo ?? "Z") + 1) % ordem.length]!;
    try {
      setEixo(orientarModelo(OV, ev, proximo));
      const c = ev.GetViewer().GetCamera();
      camInicialRef.current = new OV.Camera(
        c.eye.Clone(),
        c.center.Clone(),
        c.up.Clone(),
        c.fov,
      );
      setDica(false);
    } catch {
      /* noop */
    }
  }, [eixo]);

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        className="group inline-flex items-center gap-2.5 rounded-lg bg-pili-safety px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-pili-safety-deep"
      >
        <Box className="size-5 transition-transform group-hover:rotate-12" />
        Ver em 3D
      </button>

      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) fechar();
          }}
        >
          <style dangerouslySetInnerHTML={{ __html: MODAL_STYLES }} />

          <div className="mv-dialog relative mx-4 flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0C]">
            {bgImage && (
              <div
                className="mv-bg"
                style={{ backgroundImage: `url(${bgImage})` }}
              />
            )}
            <div className="absolute inset-0 rounded-2xl bg-[#0B0B0C]/75" />

            <div className="relative z-10 flex items-center justify-between px-5 pb-2 pt-4">
              <div>
                {titulo && (
                  <p className="mv-titulo font-display text-base font-bold text-white">
                    {titulo}
                  </p>
                )}
                <div className="mv-linha mt-1.5" />
                {subtitulo && (
                  <p className="mv-sub mt-1 text-xs text-white/40">{subtitulo}</p>
                )}
              </div>
              <button
                type="button"
                onClick={fechar}
                aria-label="Fechar"
                className="rounded-full bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="relative z-10 px-4 py-2">
              <div
                className="relative w-full overflow-hidden rounded-lg"
                style={{ height: "min(55vh, 500px)" }}
              >
                {/* touchAction none: o gesto gira o modelo em vez de rolar a página */}
                <div
                  ref={containerRef}
                  role="img"
                  aria-label={alt}
                  className="absolute inset-0 size-full"
                  style={{ touchAction: "none" }}
                />

                {dica && !carregando && !erro && (
                  <p className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white/80">
                    Arraste para girar · role para aproximar · use o botão eixo
                    se abrir deitado
                  </p>
                )}

                {!carregando && !erro && (
                  <div className="absolute bottom-3 right-3 flex flex-col items-end gap-2">
                    <div className="grid grid-cols-3 gap-1">
                      <span />
                      <BotaoViewer onClick={() => orbitar(0, 1)} label="Girar para cima">
                        <Seta d="M5 15l7-7 7 7" />
                      </BotaoViewer>
                      <span />
                      <BotaoViewer
                        onClick={() => orbitar(1, 0)}
                        label="Girar para a esquerda"
                      >
                        <Seta d="M15 19l-7-7 7-7" />
                      </BotaoViewer>
                      <BotaoViewer onClick={encaixar} label="Encaixar na tela">
                        <Seta d="M4 4v5h5M20 20v-5h-5M20 9a8 8 0 00-14-3M4 15a8 8 0 0014 3" />
                      </BotaoViewer>
                      <BotaoViewer
                        onClick={() => orbitar(-1, 0)}
                        label="Girar para a direita"
                      >
                        <Seta d="M9 5l7 7-7 7" />
                      </BotaoViewer>
                      <span />
                      <BotaoViewer
                        onClick={() => orbitar(0, -1)}
                        label="Girar para baixo"
                      >
                        <Seta d="M19 9l-7 7-7-7" />
                      </BotaoViewer>
                      <span />
                    </div>

                    <button
                      type="button"
                      onClick={trocarEixo}
                      title="Trocar o eixo vertical do modelo"
                      className="flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-3 font-mono text-xs font-semibold text-white transition-colors hover:bg-white/20 active:scale-95"
                    >
                      <Seta d="M4 4v16h16M8 16l4-8 4 8" />
                      Eixo {eixo ?? "—"}
                    </button>

                    <div className="flex gap-1">
                      <BotaoViewer onClick={() => aproximar(0.8)} label="Aproximar">
                        <Seta d="M12 5v14M5 12h14" />
                      </BotaoViewer>
                      <BotaoViewer onClick={() => aproximar(1.25)} label="Afastar">
                        <Seta d="M5 12h14" />
                      </BotaoViewer>
                    </div>
                  </div>
                )}

                {carregando && !erro && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0B0B0C]/80 text-white">
                    <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-pili-safety" />
                    <p className="text-sm text-white/50">
                      Carregando modelo 3D...
                    </p>
                  </div>
                )}

                {erro && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
                    <p className="text-sm font-medium">
                      Não foi possível exibir o modelo
                    </p>
                    <p className="mt-1 text-xs text-white/40">{erro}</p>
                    <a
                      href={src}
                      download
                      className="mt-3 rounded bg-pili-safety px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-pili-safety-deep"
                    >
                      Baixar o arquivo
                    </a>
                  </div>
                )}
              </div>
            </div>

            {cards.length > 0 && (
              <div className="relative z-10 flex flex-wrap gap-2.5 border-t border-white/5 px-5 py-4">
                {cards.map((c, i) => (
                  <div
                    key={i}
                    className={`info-card ${c.destaque ? "info-card--destaque" : ""}`}
                    style={{ animationDelay: `${0.5 + i * 0.12}s` }}
                  >
                    <div
                      className={`info-card__valor ${c.destaque ? "info-card__valor--destaque" : ""}`}
                      style={{ animationDelay: `${0.7 + i * 0.12}s` }}
                    >
                      {c.valor}
                    </div>
                    <div className="info-card__label">{c.label}</div>
                  </div>
                ))}
                <div className="ml-auto flex items-center">
                  <p className="font-display text-[10px] font-bold uppercase tracking-widest text-pili-safety">
                    PILI Industrial
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
