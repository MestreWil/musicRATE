import React from 'react';

interface VerifiedBadgeProps {
  size?: number; // tamanho em px
  className?: string; // para trocar cor via tailwind (text-red-600 etc.)
  title?: string; // acessibilidade
}

// Ícone genérico de verificado: um badge arredondado vermelho com check branco
// A cor do badge segue currentColor, então use className de texto para mudá-la.
export function VerifiedBadge({ size = 14, className = 'text-red-600', title = 'Verificado' }: VerifiedBadgeProps) {
  // Versão inline usando currentColor para permitir estilização via Tailwind (ex.: text-red-600)
  // Badge preenche com currentColor; o check é branco para melhor contraste.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-label={title}
      className={className}
    >
      <rect x="2" y="2" width="24" height="24" rx="5" fill="currentColor" />
      <path d="M7 12l3 3 7-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
