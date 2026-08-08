import type { Metadata } from 'next';

import {
  CheckoutSteps,
  OrderSummary,
  PaymentForm,
} from '@/components/checkout';
import {
  PaletteScope,
  SecureBadge,
  SiteFooter,
  SiteNav,
} from '@/components/ui';

export const metadata: Metadata = {
  title: 'Finalizar compra — Pais de Primeira Viagem',
  description:
    'Finalize a compra do guia Pais de Primeira Viagem. Pagamento seguro, acesso imediato após a confirmação.',
  // Página transacional: não deve ser indexada nem aparecer em busca.
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <PaletteScope palette="dark" className="flex min-h-screen flex-col">
      <SiteNav
        left={{ backHref: '/produto', backLabel: 'Voltar aos detalhes' }}
        right={<SecureBadge />}
        sticky={false}
      />

      <main className="flex-1 pt-14 pb-20">
        <div className="mx-auto w-full max-w-[1020px] px-6">
          <CheckoutSteps />

          <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <PaymentForm />
            <OrderSummary />
          </div>
        </div>
      </main>

      <SiteFooter showCopyright={false} />
    </PaletteScope>
  );
}
