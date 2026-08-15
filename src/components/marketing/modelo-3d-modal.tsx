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
    0% { opacity: 0; transform: translateY(20px) scale(0.9); }
    60% { opacity: 1; transform: translateY(-4px) scale(1.02); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes card-glow {
    0%, 100% { box-shadow: 0 0 0 rgba(245,197,24,0); }
    50% { box-shadow: 0 0 20px rgba(245,197,24,0.15); }
  }
  @keyframes valor-pop {
    0% { opacity: 0; transform: scale(0.5); }
    50% { transform: scale(1.15); }
    100% { opacity: 1; transform: scale(1); }
  }
  .info-card {
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 14px 18px;
    opacity: 0;
    animation: card-in 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .info-card--destaque {
    border-color: rgba(245,197,24,0.3);
    animation: card-in 0.6s cubic-bezier(0.16,1,0.3,1) forwards,
               card-glow 3s ease-in-out 1.5s infinite;
  }
  .info-card__valor {
    font-family: var(--font-display), system-ui, sans-serif;
    font-size: 22px; font-weight: 800;
    color: #fff;
    letter-spacing: -0.02em;
    opacity: 0;
    animation: valor-pop 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .info-card__valor--destaque { color: #F5C518; }
  .info-card__label {
    font-size: 10px; font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.5);
    margin-top: 2px;
    font-family: var(--font-mono), monospace;
  }
  @keyframes titulo-slide {
    0% { opacity: 0; transform: translateX(-30px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  @keyframes linha-grow {
    0% { width: 0; }
    100% { width: 48px; }
  }
  .mv-titulo { opacity: 0; animation: titulo-slide 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s forwards; }
  .mv-linha { height: 2px; width: 0; background: #E00010; animation: linha-grow 0.5s ease 0.5s forwards; }
  .mv-sub { opacity: 0; animation: titulo-slide 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s forwards; }
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
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) fechar();
          }}
        >
          <style dangerouslySetInnerHTML={{ __html: MODAL_STYLES }} />

          {bgImage && (
            <div
              className="mv-bg"
              style={{ backgroundImage: `url(${bgImage})` }}
            />
          )}
          <div className="absolute inset-0 bg-[#0B0B0C]/80" />

          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar"
            className="absolute right-4 top-4 z-20 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-6" />
          </button>

          {(titulo || subtitulo) && (
            <div className="absolute left-6 top-5 z-20 max-w-xs lg:left-10 lg:top-8 lg:max-w-sm">
              {titulo && (
                <p className="mv-titulo font-display text-lg font-bold text-white lg:text-xl">
                  {titulo}
                </p>
              )}
              <div className="mv-linha mt-2" />
              {subtitulo && (
                <p className="mv-sub mt-2 text-xs leading-relaxed text-white/50 lg:text-sm">
                  {subtitulo}
                </p>
              )}
            </div>
          )}

          {cards.length > 0 && (
            <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-wrap gap-3 lg:bottom-10 lg:left-10 lg:right-auto lg:flex-nowrap lg:gap-4">
              {cards.map((c, i) => (
                <div
                  key={i}
                  className={`info-card ${c.destaque ? "info-card--destaque" : ""}`}
                  style={{ animationDelay: `${0.6 + i * 0.15}s` }}
                >
                  <div
                    className={`info-card__valor ${c.destaque ? "info-card__valor--destaque" : ""}`}
                    style={{ animationDelay: `${0.8 + i * 0.15}s` }}
                  >
                    {c.valor}
                  </div>
                  <div className="info-card__label">{c.label}</div>
                </div>
              ))}
            </div>
          )}

          <div className="absolute bottom-5 right-6 z-20 lg:bottom-10 lg:right-10">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-pili-red">
              PILI Industrial
            </p>
          </div>

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
                width: "min(92vw, 1400px)",
                height: "min(85vh, 950px)",
                background: "transparent",
                position: "relative",
                zIndex: 10,
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
            <div className="relative z-10 flex flex-col items-center gap-3 text-white">
              <div className="size-10 animate-spin rounded-full border-2 border-white/20 border-t-pili-red" />
              <p className="text-sm text-white/60">Carregando modelo 3D...</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
