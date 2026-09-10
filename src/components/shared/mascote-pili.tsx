"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Mascote com balão de fala.
 *
 * O balão ficava fixo em cima da cabeça do robô, tapando o rosto, e repetia a
 * mesma frase para sempre. Agora ele fica fora da silhueta e as frases se
 * revezam, o que dá a impressão de alguém falando em vez de uma legenda colada.
 */
export function MascotePili({
  frases,
  largura,
  posicao = "acima",
  className,
}: {
  /** Frases que se revezam. Uma só desliga o rodízio. */
  frases: string[];
  largura: number;
  /** "acima" empilha balão e robô; "lado" põe o balão à direita. */
  posicao?: "acima" | "lado";
  className?: string;
}) {
  const [indice, setIndice] = useState(0);
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    if (frases.length < 2) return;

    // Some, troca a frase, volta: sem isso o texto pula de um para outro.
    const ciclo = setInterval(() => {
      setVisivel(false);
      setTimeout(() => {
        setIndice((i) => (i + 1) % frases.length);
        setVisivel(true);
      }, 400);
    }, 5200);

    return () => clearInterval(ciclo);
  }, [frases.length]);

  const balao = (
    <p
      className={`relative max-w-[16rem] rounded-2xl bg-pili-white px-4 py-3 text-sm font-semibold leading-snug text-pili-black shadow-lg transition-opacity duration-300 ${
        visivel ? "opacity-100" : "opacity-0"
      }`}
    >
      {frases[indice] ?? frases[0]}
      {posicao === "acima" ? (
        <span className="absolute -bottom-1.5 left-10 size-3 rotate-45 bg-pili-white" />
      ) : (
        <span className="absolute -left-1.5 bottom-4 size-3 rotate-45 bg-pili-white" />
      )}
    </p>
  );

  const robo = (
    <span className="mascote-palco block">
      <Image
        src="/images/mascote-pili.webp"
        alt="Mascote da PILI Industrial"
        width={largura}
        height={Math.round(largura * 1.04)}
        className="mascote-gira block"
        style={{ width: largura, height: "auto" }}
      />
    </span>
  );

  if (posicao === "lado") {
    return (
      <div className={`flex items-end gap-3 ${className ?? ""}`}>
        {robo}
        <span className="mb-4 block">{balao}</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-start gap-4 ${className ?? ""}`}>
      {balao}
      {robo}
    </div>
  );
}
