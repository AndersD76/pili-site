"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PontoMapa } from "@/lib/filiais";

/**
 * Mapa das unidades no rodapé, com Leaflet sobre tiles do OpenStreetMap.
 *
 * O rodapé existe em todas as páginas do site, então a biblioteca só é baixada
 * quando o bloco se aproxima da viewport: quem nunca rola até o fim não paga o
 * custo. O `import()` dinâmico mantém o Leaflet fora do bundle inicial.
 *
 * O embed simples do OSM (`/export/embed.html`, usado em /contato) aceita um
 * único marcador — por isso aqui é Leaflet, que plota as N unidades.
 *
 * Os hosts dos tiles precisam estar em `img-src` no CSP de `next.config.ts`;
 * sem isso o mapa sobe cinza, sem erro visível fora do console.
 */
export function MapaUnidades({
  pontos,
  titulo,
}: {
  pontos: PontoMapa[];
  titulo: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const mapa = useRef<LeafletMap | null>(null);

  useEffect(() => {
    const alvo = container.current;
    if (!alvo || pontos.length === 0) return;

    let cancelado = false;
    let observer: IntersectionObserver | undefined;

    async function montar() {
      // O StrictMode roda o efeito duas vezes: sem esta guarda o segundo passe
      // inicializa um mapa sobre um container que já tem um.
      if (cancelado || mapa.current || !container.current) return;

      const L = await import("leaflet");
      if (cancelado || mapa.current || !container.current) return;

      const instancia = L.map(container.current, {
        // Rolar a página sobre o mapa não pode dar zoom: o usuário está indo
        // para o fim do rodapé, não interagindo com o mapa.
        scrollWheelZoom: false,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap",
      }).addTo(instancia);

      for (const ponto of pontos) {
        const cor = ponto.matriz ? "var(--pili-safety)" : "var(--pili-white)";
        const borda = ponto.matriz ? "var(--pili-white)" : "var(--pili-safety)";

        // `divIcon` em vez do ícone padrão: o PNG default do Leaflet quebra sob
        // bundler, e assim o marcador segue a paleta do site.
        const icone = L.divIcon({
          className: "",
          html:
            `<span style="display:block;width:14px;height:14px;border-radius:9999px;` +
            `background:${cor};border:2px solid ${borda};` +
            `box-shadow:0 0 0 2px rgba(0,0,0,.45)"></span>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        L.marker([ponto.lat, ponto.lng], { icon: icone, title: ponto.nome })
          .addTo(instancia)
          .bindPopup(`<strong>${ponto.nome}</strong><br>${ponto.endereco}`);
      }

      const unico = pontos.length === 1 ? pontos[0] : undefined;
      if (unico) {
        instancia.setView([unico.lat, unico.lng], 12);
      } else {
        instancia.fitBounds(
          pontos.map((p) => [p.lat, p.lng] as [number, number]),
          { padding: [40, 40] },
        );
      }

      mapa.current = instancia;
    }

    // Navegador sem IntersectionObserver simplesmente carrega o mapa.
    if (typeof IntersectionObserver === "undefined") {
      void montar();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            observer?.disconnect();
            void montar();
          }
        },
        { rootMargin: "200px" },
      );
      observer.observe(alvo);
    }

    return () => {
      cancelado = true;
      observer?.disconnect();
      mapa.current?.remove();
      mapa.current = null;
    };
  }, [pontos]);

  if (pontos.length === 0) return null;

  return (
    <div
      ref={container}
      role="img"
      aria-label={titulo}
      className="h-56 w-full border border-pili-iron/60 bg-pili-graphite"
    />
  );
}
