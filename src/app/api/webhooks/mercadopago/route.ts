import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';

import { downloadUrlFor } from '@/lib/download-token';
import { sendDownloadEmail } from '@/lib/email';
import { env } from '@/lib/env';
import { getPaymentClient } from '@/lib/mercadopago';

export const runtime = 'nodejs';

/**
 * Confirmação de pagamento do Mercado Pago.
 *
 * Três cuidados que definem se isto é seguro ou um buraco aberto:
 *
 *  1. A assinatura (x-signature) é validada ANTES de qualquer coisa. Sem isso,
 *     qualquer um POSTa aqui e ganha o PDF de graça.
 *  2. O status é reconsultado na API. O corpo recebido diz apenas QUAL
 *     pagamento mudou, nunca se ele foi aprovado — confiar no corpo é confiar
 *     em quem chamou.
 *  3. Responde 200 mesmo em evento ignorado. Qualquer outra coisa põe o
 *     Mercado Pago em retry infinito.
 */

/**
 * Manifest esperado: `id:<data.id>;request-id:<x-request-id>;ts:<ts>;`
 * assinado em HMAC-SHA256 com o segredo do painel.
 */
function signatureIsValid(request: Request, dataId: string): boolean {
  const signature = request.headers.get('x-signature');
  const requestId = request.headers.get('x-request-id');
  if (!signature) return false;

  const parts = new Map(
    signature.split(',').map((piece) => {
      const [key, value] = piece.split('=');
      return [key?.trim() ?? '', value?.trim() ?? ''] as const;
    })
  );

  const ts = parts.get('ts');
  const v1 = parts.get('v1');
  if (!ts || !v1) return false;

  const manifest =
    `id:${dataId};` +
    (requestId ? `request-id:${requestId};` : '') +
    `ts:${ts};`;

  const expected = createHmac('sha256', env.mercadoPagoWebhookSecret)
    .update(manifest)
    .digest('hex');

  const a = Buffer.from(v1);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

type WebhookBody = {
  type?: string;
  action?: string;
  data?: { id?: string | number };
};

/** Só o que este handler realmente lê da resposta do Mercado Pago. */
type PaymentSnapshot = {
  status?: string;
  payer?: { email?: string; first_name?: string };
  metadata?: Record<string, unknown>;
};

export async function POST(request: Request): Promise<NextResponse> {
  let body: WebhookBody;
  try {
    body = (await request.json()) as WebhookBody;
  } catch {
    return NextResponse.json({ received: true, ignored: 'invalid_json' });
  }

  const dataId = body.data?.id !== undefined ? String(body.data.id) : '';

  // Só eventos de pagamento interessam; merchant_order e afins são ruído.
  if (body.type !== 'payment' || !dataId) {
    return NextResponse.json({ received: true, ignored: 'not_a_payment' });
  }

  try {
    if (!signatureIsValid(request, dataId)) {
      console.warn('[webhook] assinatura inválida', { dataId });
      return NextResponse.json({ error: 'invalid_signature' }, { status: 401 });
    }
  } catch (error) {
    // Segredo não configurado: 500 faz o Mercado Pago reenviar depois que a
    // variável for preenchida, em vez de descartar a venda.
    console.error('[webhook] falha ao validar assinatura', error);
    return NextResponse.json({ error: 'not_configured' }, { status: 500 });
  }

  try {
    // O SDK tipa metadata e payer como `any`. Um cast único aqui, na fronteira,
    // é melhor que `any` se espalhando pelo resto do handler.
    const payment = (await getPaymentClient().get({
      id: dataId,
    })) as PaymentSnapshot;

    if (payment.status !== 'approved') {
      return NextResponse.json({ received: true, status: payment.status });
    }

    const email = payment.payer?.email;
    if (!email) {
      console.error('[webhook] pagamento aprovado sem e-mail', { dataId });
      return NextResponse.json({ received: true, warning: 'missing_email' });
    }

    const metadataName = payment.metadata?.buyer_name;
    const customerName =
      typeof metadataName === 'string'
        ? metadataName
        : (payment.payer?.first_name ?? 'tudo bem');

    const result = await sendDownloadEmail({
      to: email,
      customerName,
      downloadUrl: downloadUrlFor({ email, paymentId: dataId }),
    });

    if (!result.sent) {
      // 500 pede retry ao Mercado Pago. É de propósito: e-mail não enviado
      // significa cliente pagou e não recebeu. O reenvio é idempotente
      // porque o token é derivado do paymentId, não sorteado.
      console.error('[webhook] falha ao enviar e-mail', result.error);
      return NextResponse.json({ error: 'email_failed' }, { status: 500 });
    }

    return NextResponse.json({ received: true, delivered: true });
  } catch (error) {
    console.error('[webhook] falha ao processar', error);
    return NextResponse.json({ error: 'processing_failed' }, { status: 500 });
  }
}
