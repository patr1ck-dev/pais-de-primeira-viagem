import type { Metadata } from 'next';

import { PaletteScope } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Finalizar compra — Pais de Primeira Viagem',
  description:
    'Finalize a compra do guia Pais de Primeira Viagem. Pagamento seguro, acesso imediato após a confirmação.',
  // Página transacional: não deve ser indexada nem aparecer em busca.
  robots: { index: false, follow: false },
};

// Esqueleto da Fase 2. PaymentForm, OrderSummary e PixQrCode entram nas Fases 3 e 4.
export default function CheckoutPage() {
  return (
    <PaletteScope palette="dark" className="min-h-screen">
      <main className="max-w-site mx-auto px-6 py-24">
        <h1 className="text-4xl">Finalizar compra</h1>
        <p className="text-muted mt-4">Formulário chega nas Fases 3 e 4.</p>
      </main>
    </PaletteScope>
  );
}
