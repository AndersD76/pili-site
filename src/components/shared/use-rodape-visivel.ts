"use client";

import { useEffect, useState } from "react";

/**
 * Diz se o rodapé está na tela.
 *
 * Os botões flutuantes ficam presos no canto inferior e, ao chegar no fim da
 * página, cobriam justamente o rodapé: o mapa da unidade, os telefones e as
 * redes sociais ficavam atrás deles. Saber que o rodapé apareceu permite tirar
 * os botões de cena — a informação de contato que eles oferecem já está ali.
 */
export function useRodapeVisivel(): boolean {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const rodape = document.querySelector("footer");
    if (!rodape) return;

    const observador = new IntersectionObserver(
      (entradas) => setVisivel(entradas[0]?.isIntersecting ?? false),
      // Basta uma faixa do rodapé aparecer para os botões saírem da frente.
      { threshold: 0.02 },
    );
    observador.observe(rodape);

    return () => observador.disconnect();
  }, []);

  return visivel;
}
