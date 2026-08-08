'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

/**
 * Campos de cartão do Mercado Pago (Card Payment Brick).
 *
 * Por que um Brick em vez dos <input> do protótipo: o Brick tokeniza o cartão
 * DENTRO DO NAVEGADOR e entrega ao nosso servidor apenas um token descartável.
 * O número do cartão nunca passa pela nossa infraestrutura — é o que mantém o
 * projeto fora do escopo de auditoria PCI-DSS.
 *
 * O custo é visual: os campos são renderizados pelo Mercado Pago num iframe,
 * então seguem o tema que configuramos aqui, mas não ficam pixel a pixel
 * idênticos ao protótipo. O Pix continua 100% nosso.
 */

// O SDK toca em window no import: precisa ficar fora do server render.
const CardPayment = dynamic(
  () => import('@mercadopago/sdk-react').then((mod) => mod.CardPayment),
  { ssr: false }
);

export type CardBrickSubmitData = {
  token: string;
  paymentMethodId: string;
  installments: number;
  issuerId?: string;
  identificationType?: string;
  identificationNumber?: string;
};

type CardBrickProps = {
  publicKey: string;
  amount: number;
  onSubmit: (data: CardBrickSubmitData) => Promise<void>;
  onError?: (message: string) => void;
};

/** Formato que o Brick entrega no onSubmit. */
type BrickFormData = {
  token?: string;
  payment_method_id?: string;
  issuer_id?: string | number;
  installments?: number;
  payer?: {
    identification?: { type?: string; number?: string };
  };
};

export function CardBrick({
  publicKey,
  amount,
  onSubmit,
  onError,
}: CardBrickProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void import('@mercadopago/sdk-react').then((mod) => {
      if (cancelled) return;
      mod.initMercadoPago(publicKey, { locale: 'pt-BR' });
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [publicKey]);

  if (!ready) {
    return (
      <div className="border-line bg-surface-2 mb-[18px] rounded-[10px] border px-4 py-8 text-center">
        <p className="text-muted text-[0.85rem]">
          Carregando pagamento seguro…
        </p>
      </div>
    );
  }

  return (
    <div className="mb-[18px]">
      <CardPayment
        initialization={{ amount }}
        customization={{
          visual: {
            style: {
              theme: 'dark',
              customVariables: {
                baseColor: '#12b981',
                formBackgroundColor: '#111114',
                inputBackgroundColor: '#111114',
                textPrimaryColor: '#f5f5f7',
                textSecondaryColor: '#8b8d96',
                borderRadiusMedium: '10px',
                buttonTextColor: '#04140d',
              },
            },
          },
        }}
        onSubmit={async (formData: BrickFormData) => {
          if (!formData.token || !formData.payment_method_id) {
            onError?.('Não foi possível validar o cartão. Confira os dados.');
            return;
          }
          await onSubmit({
            token: formData.token,
            paymentMethodId: formData.payment_method_id,
            installments: formData.installments ?? 1,
            issuerId:
              formData.issuer_id !== undefined
                ? String(formData.issuer_id)
                : undefined,
            identificationType: formData.payer?.identification?.type,
            identificationNumber: formData.payer?.identification?.number,
          });
        }}
        onError={() => {
          onError?.('Não foi possível processar o cartão. Tente novamente.');
        }}
      />
    </div>
  );
}

/** Mostrado enquanto a chave pública do Mercado Pago não estiver configurada. */
export function CardUnavailable() {
  return (
    <div className="border-line bg-surface-2 mb-[18px] rounded-[10px] border border-dashed px-4 py-5 text-center">
      <p className="text-muted text-[0.85rem]">
        Pagamento com cartão indisponível no momento.
      </p>
      <p className="text-faint mt-1.5 text-[0.78rem]">
        Use o Pix para concluir sua compra agora.
      </p>
    </div>
  );
}
