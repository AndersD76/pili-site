"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Box } from "lucide-react";

const SCRIPT_SRC = "/vendor/model-viewer-3.5.0.min.js";

function carregarScript(): Promise<void> {
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.type = "module";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Falha ao carregar o viewer 3D"));
    document.head.appendChild(s);
  });
}

export interface Hotspot3D {
  position: string;
  normal: string;
  label: string;
}

export interface InfoCard3D {
  valor: string;
  label: string;
  destaque?: boolean;
}

interface Modelo3DModalProps {
  src: string;
  poster?: string;
  bgImage?: string;
  alt?: string;
  titulo?: string;
  subtitulo?: string;
  hotspots?: Hotspot3D[];
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
  .hs3d {
    position: relative;
    display: flex;
    align-items: center;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .hs3d[visible] { opacity: 1; }
  .hs3d__dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: #F5C518;
    border: 2px solid rgba(255,255,255,0.8);
    box-shadow: 0 0 12px rgba(245,197,24,0.5);
    position: relative; z-index: 2; flex-shrink: 0;
  }
  .hs3d__dot::after {
    content: '';
    position: absolute; inset: -4px;
    border-radius: 50%;
    border: 1.5px solid rgba(245,197,24,0.4);
    animation: hs-pulse 2s ease-in-out infinite;
  }
  @keyframes hs-pulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.6); opacity: 0; }
  }
  .hs3d__line {
    width: 32px; height: 1px;
    background: linear-gradient(90deg, rgba(245,197,24,0.8), rgba(245,197,24,0.2));
    flex-shrink: 0;
  }
  .hs3d__label {
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(245,197,24,0.3);
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #F5C518;
    white-space: nowrap;
    font-family: var(--font-display), system-ui, sans-serif;
  }
  @keyframes card-in {
    0% { opacity: 0; transform: translateY(16px) scale(0.92); }
    60% { opacity: 1; transform: translateY(-3px) scale(1.01); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes card-glow {
    0%, 100% { box-shadow: 0 0 0 rgba(245,197,24,0); }
    50% { box-shadow: 0 0 16px rgba(245,197,24,0.12); }
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
    border-color: rgba(245,197,24,0.25);
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
  .info-card__valor--destaque { color: #F5C518; }
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
  @keyframes linha-grow {
    0% { width: 0; }
    100% { width: 40px; }
  }
  @keyframes dialog-in {
    0% { opacity: 0; transform: scale(0.95) translateY(10px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  .mv-titulo { opacity: 0; animation: titulo-slide 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s forwards; }
  .mv-linha { height: 2px; width: 0; background: #E00010; animation: linha-grow 0.4s ease 0.4s forwards; }
  .mv-sub { opacity: 0; animation: titulo-slide 0.6s cubic-bezier(0.16,1,0.3,1) 0.35s forwards; }
  .mv-dialog { animation: dialog-in 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
`;

export function Modelo3DModal({
  src,
  poster,
  bgImage,
  alt = "Modelo 3D do equipamento",
  titulo,
  subtitulo,
  hotspots = [],
  cards = [],
}: Modelo3DModalProps) {
  const [aberto, setAberto] = useState(false);
  const [pronto, setPronto] = useState(false);

  const abrir = useCallback(() => setAberto(true), []);
  const fechar = useCallback(() => setAberto(false), []);

  useEffect(() => {
    if (!aberto) return;

    let cancelado = false;
    carregarScript().then(() => {
      if (!cancelado) setPronto(true);
    });

    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") fechar();
    }
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";

    return () => {
      cancelado = true;
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [aberto, fechar]);

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        className="group inline-flex items-center gap-2.5 rounded-lg bg-pili-red px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-pili-red/90"
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

            <div className="relative z-10 flex items-center justify-between px-5 pt-4 pb-2">
              <div>
                {titulo && (
                  <p className="mv-titulo font-display text-base font-bold text-white">
                    {titulo}
                  </p>
                )}
                <div className="mv-linha mt-1.5" />
                {subtitulo && (
                  <p className="mv-sub mt-1 text-xs text-white/40">
                    {subtitulo}
                  </p>
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

            <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-2">
              {pronto ? (
                <model-viewer
                  src={src}
                  poster={poster}
                  alt={alt}
                  auto-rotate=""
                  auto-rotate-delay="800"
                  rotation-per-second="20deg"
                  camera-controls=""
                  camera-orbit="45deg 65deg 105%"
                  interaction-prompt="none"
                  min-field-of-view="18deg"
                  shadow-intensity="1.2"
                  shadow-softness="0.8"
                  exposure="1.1"
                  environment-image="neutral"
                  loading="eager"
                  style={{
                    width: "100%",
                    height: "min(55vh, 500px)",
                    background: "transparent",
                    // @ts-expect-error -- CSS custom properties for model-viewer
                    "--poster-color": "transparent",
                    "--progress-bar-color": "#E00010",
                    "--progress-mask": "transparent",
                  }}
                >
                  {hotspots.map((h, i) => (
                    <div
                      key={i}
                      className="hs3d"
                      slot={`hotspot-${i + 1}`}
                      data-position={h.position}
                      data-normal={h.normal}
                      data-visibility-attribute="visible"
                    >
                      <span className="hs3d__dot" />
                      <span className="hs3d__line" />
                      <span className="hs3d__label">{h.label}</span>
                    </div>
                  ))}
                </model-viewer>
              ) : (
                <div className="flex flex-col items-center gap-3 py-20 text-white">
                  <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-pili-red" />
                  <p className="text-sm text-white/50">Carregando modelo 3D...</p>
                </div>
              )}
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
                  <p className="font-display text-[10px] font-bold uppercase tracking-widest text-pili-red">
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
