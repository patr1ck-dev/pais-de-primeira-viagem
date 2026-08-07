import type { Metadata } from 'next';

import { PaletteScope } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Obrigado — Pais de Primeira Viagem',
  robots: { index: false, follow: false },
};

// Esqueleto da Fase 2. Status do pagamento e botão de download entram na Fase 5.
export default function ObrigadoPage() {
  return (
    <PaletteScope palette="dark" className="min-h-screen">
      <main className="max-w-site mx-auto px-6 py-24">
        <h1 className="text-4xl">Obrigado pela compra</h1>
        <p className="text-muted mt-4">Status e download chegam na Fase 5.</p>
      </main>
    </PaletteScope>
  );
}
