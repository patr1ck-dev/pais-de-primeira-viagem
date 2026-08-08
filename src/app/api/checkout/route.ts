import { NextResponse } from 'next/server';

import {
  checkoutRequestSchema,
  splitName,
  type CardCheckoutRequest,
  type CheckoutErrorResponse,
  type CheckoutResponse,
  type PixCheckoutRequest,
} from '@/lib/checkout-schema';
import { env } from '@/lib/env';
import { getPaymentClient, newIdempotencyKey } from '@/lib/mercadopago';
import { PRODUCT, toAmount } from '@/lib/product';

/** O SDK cria a cobrança; sem runtime Node o crypto/idempotência não roda. */
export const runtime = 'nodejs';

/** Minutos até o Pix expirar. Curto o bastante para não prender estoque. */
const PIX_EXPIRATION_MINUTES = 30;

function fail(
  status: number,
  body: CheckoutErrorResponse
): NextResponse<CheckoutErrorResponse> {
  return NextResponse.json(body, { status });
}

export async function POST(
  request: Request
): Promise<NextResponse<CheckoutResponse | CheckoutErrorResponse>> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return fail(400, {
      error: 'invalid_json',
      message: 'Corpo da requisição inválido.',
    });
  }

  const parsed = checkoutRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return fail(422, {
      error: 'validation_error',
      message: 'Confira os dados informados.',
      fields: parsed.error.flatten().fieldErrors,
    });
  }

  const input = parsed.data;
  const { firstName, lastName } = splitName(input.name);

  // O valor NUNCA vem do corpo da request — só daqui.
  const amount = toAmount(PRODUCT.priceInCents);

  // Liga o pagamento ao comprador para o webhook da Fase 5 saber a quem
  // entregar o PDF, sem precisar de banco de dados.
  const externalReference = JSON.stringify({
    email: input.email,
    product: PRODUCT.id,
  });

  const base = {
    transaction_amount: amount,
    description: `${PRODUCT.name} — ${PRODUCT.subtitle}`,
    external_reference: externalReference,
    notification_url: `${env.siteUrl}/api/webhooks/mercadopago`,
    statement_descriptor: 'PAISPRIMEIRAVIAGEM',
    metadata: { product_id: PRODUCT.id, buyer_name: input.name },
  };

  try {
    const client = getPaymentClient();
    const requestOptions = { idempotencyKey: newIdempotencyKey() };

    if (input.method === 'pix') {
      return NextResponse.json(
        await createPix(
          client,
          base,
          input,
          firstName,
          lastName,
          requestOptions
        )
      );
    }

    return NextResponse.json(
      await createCard(client, base, input, firstName, lastName, requestOptions)
    );
  } catch (error) {
    // Nunca vaza a mensagem crua do gateway para o comprador: pode conter
    // detalhe de credencial. O log fica no servidor.
    console.error('[checkout] falha ao criar pagamento', error);

    if (
      error instanceof Error &&
      /MERCADOPAGO_ACCESS_TOKEN/.test(error.message)
    ) {
      return fail(503, {
        error: 'payment_not_configured',
        message: 'Pagamento indisponível no momento. Tente novamente em breve.',
      });
    }

    return fail(502, {
      error: 'payment_gateway_error',
      message: 'Não foi possível iniciar o pagamento. Tente novamente.',
    });
  }
}

type PaymentClient = ReturnType<typeof getPaymentClient>;
type RequestOptions = { idempotencyKey: string };

async function createPix(
  client: PaymentClient,
  base: Record<string, unknown>,
  input: PixCheckoutRequest,
  firstName: string,
  lastName: string,
  requestOptions: RequestOptions
): Promise<CheckoutResponse> {
  const expiresAt = new Date(
    Date.now() + PIX_EXPIRATION_MINUTES * 60_000
  ).toISOString();

  const result = await client.create({
    body: {
      ...base,
      payment_method_id: 'pix',
      date_of_expiration: expiresAt,
      payer: { email: input.email, first_name: firstName, last_name: lastName },
    },
    requestOptions,
  });

  const data = result.point_of_interaction?.transaction_data;

  return {
    method: 'pix',
    paymentId: String(result.id ?? ''),
    status: result.status ?? 'unknown',
    qrCodeBase64: data?.qr_code_base64 ?? null,
    qrCode: data?.qr_code ?? null,
    ticketUrl: data?.ticket_url ?? null,
    expiresAt: result.date_of_expiration ?? expiresAt,
  };
}

async function createCard(
  client: PaymentClient,
  base: Record<string, unknown>,
  input: CardCheckoutRequest,
  firstName: string,
  lastName: string,
  requestOptions: RequestOptions
): Promise<CheckoutResponse> {
  const result = await client.create({
    body: {
      ...base,
      // `token` é descartável e gerado no navegador pelo Brick.
      token: input.token,
      payment_method_id: input.paymentMethodId,
      installments: input.installments,
      // O Brick devolve issuer_id como string; o SDK tipa como número.
      ...(input.issuerId ? { issuer_id: Number(input.issuerId) } : {}),
      payer: {
        email: input.email,
        first_name: firstName,
        last_name: lastName,
        ...(input.identificationType && input.identificationNumber
          ? {
              identification: {
                type: input.identificationType,
                number: input.identificationNumber,
              },
            }
          : {}),
      },
    },
    requestOptions,
  });

  return {
    method: 'card',
    paymentId: String(result.id ?? ''),
    status: result.status ?? 'unknown',
    statusDetail: result.status_detail ?? '',
  };
}
