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

interface Modelo3DModalProps {
  src: string;
  poster?: string;
  alt?: string;
  titulo?: string;
  hotspots?: Hotspot3D[];
}

const HOTSPOT_STYLES = `
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
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #F5C518;
    border: 2px solid rgba(255,255,255,0.8);
    box-shadow: 0 0 12px rgba(245,197,24,0.5);
    position: relative;
    z-index: 2;
    flex-shrink: 0;
  }
  .hs3d__dot::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 1.5px solid rgba(245,197,24,0.4);
    animation: hs-pulse 2s ease-in-out infinite;
  }
  @keyframes hs-pulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.6); opacity: 0; }
  }
  .hs3d__line {
    width: 32px;
    height: 1px;
    background: linear-gradient(90deg, rgba(245,197,24,0.8), rgba(245,197,24,0.2));
    flex-shrink: 0;
  }
  .hs3d__label {
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(245,197,24,0.3);
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #F5C518;
    white-space: nowrap;
    font-family: var(--font-display), system-ui, sans-serif;
  }
`;

export function Modelo3DModal({
  src,
  poster,
  alt = "Modelo 3D do equipamento",
  titulo,
  hotspots = [],
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0C]/95 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) fechar();
          }}
        >
          <style dangerouslySetInnerHTML={{ __html: HOTSPOT_STYLES }} />

          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-6" />
          </button>

          {titulo && (
            <div className="absolute left-6 top-5 z-10">
              <p className="font-display text-lg font-bold text-white">
                {titulo}
              </p>
            </div>
          )}

          <div className="absolute bottom-5 left-6 z-10">
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
              auto-rotate-delay="1200"
              rotation-per-second="16deg"
              camera-controls=""
              interaction-prompt="none"
              min-field-of-view="12deg"
              shadow-intensity="1.1"
              shadow-softness="0.9"
              exposure="1.05"
              environment-image="neutral"
              loading="eager"
              style={{
                width: "min(90vw, 1200px)",
                height: "min(80vh, 900px)",
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
            <div className="flex flex-col items-center gap-3 text-white">
              <div className="size-10 animate-spin rounded-full border-2 border-white/20 border-t-pili-red" />
              <p className="text-sm text-white/60">Carregando modelo 3D...</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
