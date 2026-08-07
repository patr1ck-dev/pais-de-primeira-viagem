import type { Metadata } from 'next';
import { Fraunces, Inter, Manrope } from 'next/font/google';
import type { ReactNode } from 'react';

import '@/styles/globals.css';

/*
 * As três famílias são carregadas no root porque cada paleta escolhe a sua via
 * --font-heading. next/font baixa e auto-hospeda os arquivos no build, então
 * some o <link> para fonts.googleapis.com do protótipo — menos uma conexão de
 * terceiro no caminho crítico do checkout.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pais de Primeira Viagem — Guia Completo para os Primeiros Meses',
  description:
    'O guia digital que acompanha você nos primeiros meses do bebê: banho, fraldas, roupas e primeiros socorros, explicados com calma. Acesso imediato.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${fraunces.variable} ${manrope.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
