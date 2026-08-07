import { NextResponse } from 'next/server';

/**
 * Valida o token assinado e serve o PDF.
 *
 * ⚠️ PONTO DE INTEGRAÇÃO — Fase 5.
 *
 * O PDF NÃO pode viver em public/: tudo que está lá é servido por URL direta e
 * o token viraria decoração. Ele fica fora da pasta pública (ou num bucket) e
 * só esta rota o lê, depois de conferir assinatura e expiração.
 */
export function GET(): NextResponse {
  return NextResponse.json(
    { error: 'not_implemented', phase: 5 },
    { status: 501 }
  );
}
