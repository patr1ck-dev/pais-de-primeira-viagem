/**
 * Fonte única do produto e do preço.
 *
 * O protótipo divergia em três lugares (landing "a partir de R$ 29,90",
 * checkout "39,90 − 10,00", produto "R$29–49"). Como o mesmo número vai ser
 * exibido na tela E enviado ao Mercado Pago na Fase 4, ele precisa vir daqui:
 * preço de tela diferente do preço cobrado é estorno na certa.
 *
 * Valores em centavos para não carregar erro de ponto flutuante até o gateway.
 */

export const PRODUCT = {
  id: 'guia-pais-primeira-viagem',
  name: 'Pais de Primeira Viagem',
  subtitle: 'Guia Completo para os Primeiros Meses',
  description: 'Guia digital · 5 capítulos · acesso imediato',
  listPriceInCents: 3990,
  priceInCents: 2990,
  currency: 'BRL',
  guaranteeDays: 7,
  chapters: 5,
} as const;

export const DISCOUNT_IN_CENTS =
  PRODUCT.listPriceInCents - PRODUCT.priceInCents;

/** Converte centavos para o formato brasileiro. Ex.: 2990 -> "R$ 29,90". */
export function formatBRL(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: PRODUCT.currency,
  }).format(cents / 100);
}

/** O Mercado Pago espera um número decimal, não centavos. */
export function toAmount(cents: number): number {
  return cents / 100;
}
