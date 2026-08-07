import { NextResponse } from 'next/server';

/**
 * Recebe a confirmação de pagamento do Mercado Pago.
 *
 * ⚠️ PONTO DE INTEGRAÇÃO — Fase 5.
 *
 * Cuidados que a implementação precisa ter:
 *  - validar a assinatura do webhook (header x-signature) antes de qualquer
 *    coisa: sem isso, qualquer um POSTa aqui e ganha o PDF de graça;
 *  - reconsultar o pagamento na API em vez de confiar no corpo recebido;
 *  - ser idempotente — o Mercado Pago reenvia o mesmo evento;
 *  - responder 200 rápido, mesmo em evento ignorado, ou entra em retry.
 */
export function POST(): NextResponse {
  return NextResponse.json(
    { error: 'not_implemented', phase: 5 },
    { status: 501 }
  );
}
