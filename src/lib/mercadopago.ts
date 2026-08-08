import { MercadoPagoConfig, Payment } from 'mercadopago';

import { env } from '@/lib/env';

/**
 * Cliente do SDK do Mercado Pago.
 *
 * ⚠️ PONTO DE INTEGRAÇÃO — preencha MERCADOPAGO_ACCESS_TOKEN no .env.local
 * (credencial de TESTE, começa com `TEST-`, enquanto estiver em sandbox).
 *
 * O cliente é criado sob demanda, não no import: se fosse no topo do módulo,
 * qualquer rota que importasse este arquivo quebraria o build sem credencial —
 * e o requisito é que as Fases 1 a 3 subam sem chave nenhuma.
 */

let cached: Payment | null = null;

export function getPaymentClient(): Payment {
  if (cached) return cached;

  const client = new MercadoPagoConfig({
    accessToken: env.mercadoPagoAccessToken,
    options: {
      // O checkout é síncrono para o comprador: melhor falhar rápido e deixar
      // ele tentar de novo do que pendurar a tela esperando o gateway.
      timeout: 8000,
    },
  });

  cached = new Payment(client);
  return cached;
}

/** Só para testes: descarta o cliente memoizado entre casos. */
export function resetPaymentClient(): void {
  cached = null;
}

/**
 * Chave de idempotência por tentativa de compra.
 *
 * O Mercado Pago usa esse cabeçalho para não criar duas cobranças quando o
 * comprador clica duas vezes ou a rede repete a request.
 */
export function newIdempotencyKey(): string {
  return crypto.randomUUID();
}
