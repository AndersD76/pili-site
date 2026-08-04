"use client";

import { motion } from "framer-motion";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

/**
 * Altura do header fixo em pixels (`--header-height: 5.5rem`).
 *
 * A margem de viewport do Framer Motion não aceita `var()`, então o valor é
 * repetido aqui. Sem descontá-lo, a animação dispara enquanto o elemento ainda
 * está atrás do header e o usuário vê o conteúdo já montado ao rolar.
 */
const HEADER_HEIGHT_PX = 88;

export function AnimateOnScroll({
  children,
  className,
  delay = 0,
  direction = "up",
}: AnimateOnScrollProps) {
  const directionOffset = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{
        once: true,
        // topo: recua até abaixo do header; base: antecipa a entrada.
        margin: `-${HEADER_HEIGHT_PX + 24}px 0px -80px 0px`,
      }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
