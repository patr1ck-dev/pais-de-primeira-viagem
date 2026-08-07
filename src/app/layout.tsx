import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Pais de Primeira Viagem — Guia Completo para os Primeiros Meses',
  description:
    'O guia digital que acompanha você nos primeiros meses do bebê: banho, fraldas, roupas e primeiros socorros, explicados com calma. Acesso imediato.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
