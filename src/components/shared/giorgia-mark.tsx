/**
 * Marca da GiorgIA.
 *
 * Substitui o ícone `Bot` do lucide, que é o mesmo robô genérico usado por
 * qualquer chat da internet e não dizia nada sobre a assistente. O desenho é o
 * monograma "G" aberto à direita, com a faísca de quatro pontas do "IA" no
 * canto superior — geometria simples o bastante para continuar legível nos
 * 20 px do cabeçalho do painel.
 *
 * Tudo em `currentColor`: herda o branco sobre o círculo vermelho do botão e o
 * cinza sobre fundo claro, sem variante de cor.
 */
export function GiorgiaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Anel do "G", aberto à direita */}
      <path
        d="M16.6 9.5A7 7 0 1 0 16.6 16.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Haste e barra do "G" */}
      <path
        d="M16.6 16.5V13h-4"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Faísca do "IA" */}
      <path
        d="M20 2.2l.85 2.1 2.1.85-2.1.85-.85 2.1-.85-2.1-2.1-.85 2.1-.85z"
        fill="currentColor"
      />
    </svg>
  );
}
