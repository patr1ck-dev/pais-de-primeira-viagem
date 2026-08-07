import type { Metadata } from 'next';

import { PaletteScope } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Pais de Primeira Viagem — O que tem dentro do guia',
  description:
    'Conheça todos os capítulos do guia Pais de Primeira Viagem: banho, fraldas, roupas e primeiros socorros, explicados com calma. Garantia de 7 dias.',
};

// Esqueleto da Fase 2. Capítulos, features, stats, FAQ e CTA entram na Fase 3.
export default function ProdutoPage() {
  return (
    <PaletteScope palette="dark" className="min-h-screen">
      <main className="max-w-site mx-auto px-6 py-24">
        <h1 className="text-4xl">Detalhes do guia</h1>
        <p className="text-muted mt-4">Conteúdo chega na Fase 3.</p>
      </main>
    </PaletteScope>
  );
}
