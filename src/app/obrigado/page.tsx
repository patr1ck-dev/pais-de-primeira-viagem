import type { Metadata } from 'next';

import { Button, PaletteScope, SiteFooter, SiteNav } from '@/components/ui';
import { createDownloadToken } from '@/lib/download-token';
import { getPaymentClient } from '@/lib/mercadopago';

export const metadata: Metadata = {
  title: 'Obrigado — Pais de Primeira Viagem',
  robots: { index: false, follow: false },
};

// Consulta o gateway a cada visita: status de pagamento não pode ser cacheado.
export const dynamic = 'force-dynamic';

type Outcome =
  | { kind: 'approved'; email: string; token: string }
  | { kind: 'pending' }
  | { kind: 'rejected' }
  | { kind: 'unknown' };

async function resolveOutcome(paymentId: string | undefined): Promise<Outcome> {
  if (!paymentId) return { kind: 'unknown' };

  try {
    const payment = await getPaymentClient().get({ id: paymentId });
    const email = payment.payer?.email;

    if (payment.status === 'approved' && email) {
      // O token é gerado aqui, no servidor, a partir do status REAL — nunca
      // a partir de um parâmetro da URL. Assim ninguém libera o download
      // inventando um payment_id na barra de endereço.
      return {
        kind: 'approved',
        email,
        token: createDownloadToken({ email, paymentId }),
      };
    }

    if (payment.status === 'rejected' || payment.status === 'cancelled') {
      return { kind: 'rejected' };
    }

    return { kind: 'pending' };
  } catch {
    return { kind: 'unknown' };
  }
}

export default async function ObrigadoPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string }>;
}) {
  const { payment_id: paymentId } = await searchParams;
  const outcome = await resolveOutcome(paymentId);

  return (
    <PaletteScope palette="dark" className="flex min-h-screen flex-col">
      <SiteNav left={{ backHref: '/', backLabel: 'Início' }} sticky={false} />

      <main className="flex flex-1 items-center justify-center px-6 py-20">
        <div className="bg-surface-raised border-line w-full max-w-[560px] rounded-[18px] border p-8 text-center sm:p-11">
          {outcome.kind === 'approved' && (
            <>
              <div
                aria-hidden="true"
                className="bg-accent-soft text-accent mx-auto mb-6 flex size-14 items-center justify-center rounded-full text-2xl"
              >
                ✓
              </div>
              <h1 className="mb-3 text-[1.6rem]">Pagamento confirmado</h1>
              <p className="text-muted mb-8 text-[0.95rem]">
                Enviamos o guia para{' '}
                <strong className="text-content">{outcome.email}</strong>. Se
                não chegar em alguns minutos, confira o spam — ou baixe aqui
                mesmo.
              </p>
              <Button href={`/download/${outcome.token}`} fullWidth>
                Baixar agora
              </Button>
              <p className="text-faint mt-4 text-[0.78rem]">
                O link vale por 7 dias. Salve o PDF no celular.
              </p>
            </>
          )}

          {outcome.kind === 'pending' && (
            <>
              <h1 className="mb-3 text-[1.6rem]">Aguardando confirmação</h1>
              <p className="text-muted mb-8 text-[0.95rem]">
                O pagamento ainda está sendo processado. Assim que for aprovado,
                o guia chega no seu e-mail automaticamente — você não precisa
                fazer mais nada.
              </p>
              <p className="text-faint text-[0.82rem]">
                Pode fechar esta página com tranquilidade.
              </p>
            </>
          )}

          {outcome.kind === 'rejected' && (
            <>
              <h1 className="mb-3 text-[1.6rem]">Pagamento não aprovado</h1>
              <p className="text-muted mb-8 text-[0.95rem]">
                O pagamento foi recusado e nada foi cobrado. Você pode tentar de
                novo com outro método.
              </p>
              <Button href="/checkout" fullWidth>
                Tentar novamente
              </Button>
            </>
          )}

          {outcome.kind === 'unknown' && (
            <>
              <h1 className="mb-3 text-[1.6rem]">Obrigado pela compra</h1>
              <p className="text-muted mb-8 text-[0.95rem]">
                Não conseguimos localizar este pagamento agora. Se você concluiu
                a compra, o guia chega no seu e-mail assim que a confirmação for
                processada.
              </p>
              <Button href="/" variant="ghost" fullWidth>
                Voltar ao início
              </Button>
            </>
          )}
        </div>
      </main>

      <SiteFooter showCopyright={false} />
    </PaletteScope>
  );
}
