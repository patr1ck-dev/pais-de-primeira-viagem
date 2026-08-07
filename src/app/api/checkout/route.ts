import { NextResponse } from 'next/server';

/**
 * Cria a cobrança no Mercado Pago (Pix ou cartão).
 *
 * ⚠️ PONTO DE INTEGRAÇÃO — Fase 4.
 * Entrada: nome + e-mail + método. Saída: QR code (Pix) ou os dados do fluxo
 * de cartão. O valor vem de PRODUCT.priceInCents, nunca do corpo da request —
 * senão o cliente escolhe quanto pagar.
 */
export function POST(): NextResponse {
  return NextResponse.json(
    { error: 'not_implemented', phase: 4 },
    { status: 501 }
  );
}
