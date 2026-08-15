"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { SlideData } from "@/lib/hero-slides";

/** Tempo de cada slide. Longo de propósito: o hero tem texto para ler. */
const INTERVALO_MS = 7000;

/**
 * Carrossel de fundo do hero da home.
 *
 * Os slides vêm do painel. Quando não há nenhum cadastrado, a home passa um
 * único slide montado com a imagem padrão e o título das mensagens — assim
 * existe um só caminho de render, em vez de um layout alternativo que ninguém
 * olha até o dia em que o banco fica vazio.
 *
 * Com um slide só, nada gira e os controles não aparecem.
 */
export function HeroCarousel({
  slides,
  badge,
  acoes,
}: {
  slides: SlideData[];
  badge?: React.ReactNode;
  acoes?: React.ReactNode;
}) {
  const [atual, setAtual] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = slides.length;

  // Só liga a rotação depois de saber a preferência de movimento do usuário.
  useEffect(() => {
    if (total <= 1) return;

    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (consulta.matches) return;

    timer.current = setInterval(
      () => setAtual((i) => (i + 1) % total),
      INTERVALO_MS,
    );

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [total]);

  /** Clique manual assume o controle: a rotação automática para. */
  const irPara = useCallback((indice: number) => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setAtual(indice);
  }, []);

  const slide = slides[atual] ?? slides[0];
  if (!slide) return null;

  return (
    <>
      {slides.map((s, i) => (
        <Image
          key={s.id}
          src={s.imagem}
          alt={s.alt}
          fill
          // Só a primeira entra no carregamento crítico: as demais só aparecem
          // depois de 7 segundos, e disputar banda com elas atrasa o LCP.
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${
            i === atual ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-pili-black via-pili-black/85 to-pili-black/30" />

      {/* Yellow accent bar — left side */}
      <div className="absolute left-0 top-0 h-full w-1.5 bg-pili-safety lg:w-2" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      <div className="relative z-10 max-w-5xl">
        {badge}

        <h1 className="font-display text-[length:var(--text-display-1)] font-black uppercase leading-[0.95] tracking-tight text-pili-white">
          {slide.titulo}
        </h1>

        {slide.subtitulo && (
          <div className="mt-6 flex items-center gap-4">
            <div className="h-px w-12 bg-pili-safety" />
            <p className="max-w-xl font-mono text-sm tracking-wide text-pili-cement">
              {slide.subtitulo}
            </p>
          </div>
        )}

        {acoes}

        {total > 1 && (
          <div className="mt-10 flex items-center gap-3">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => irPara(i)}
                aria-label={s.titulo}
                aria-current={i === atual}
                className={`h-1.5 transition-all ${
                  i === atual
                    ? "w-10 bg-pili-safety"
                    : "w-5 bg-pili-white/40 hover:bg-pili-white/70"
                }`}
              />
            ))}
            {/* Anuncia a troca de slide para leitores de tela, tanto na
                rotação automática quanto no clique. */}
            <span className="sr-only" aria-live="polite">
              {slide.titulo}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
