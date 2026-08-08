import { describe, expect, it } from 'vitest';

import { DISCOUNT_IN_CENTS, formatBRL, PRODUCT, toAmount } from './product';

/*
 * O Intl em pt-BR separa "R$" do número com espaço NÃO-QUEBRÁVEL (U+00A0), não
 * com espaço comum. Isso é o comportamento desejado — impede que o símbolo caia
 * numa linha e o valor na seguinte. A constante usa o escape em vez do
 * caractere literal: NBSP colado no código é invisível e ninguém acha o bug.
 * Quem escrever "R$ 29,90" com espaço normal vai ver o teste falhar; é de
 * propósito.
 */
const NBSP = ' ';

describe('formatBRL', () => {
  it('formata centavos no padrão brasileiro', () => {
    expect(formatBRL(2990)).toBe(`R$${NBSP}29,90`);
    expect(formatBRL(3990)).toBe(`R$${NBSP}39,90`);
  });

  it('separa símbolo e valor com espaço não-quebrável', () => {
    expect(formatBRL(2990)).toContain(NBSP);
    expect(formatBRL(2990)).not.toContain('R$ ');
  });

  it('sempre mostra duas casas decimais', () => {
    // O checkout exibe "R$ 10,00", não "R$ 10" — valor quebrado assusta comprador.
    expect(formatBRL(1000)).toBe(`R$${NBSP}10,00`);
    expect(formatBRL(0)).toBe(`R$${NBSP}0,00`);
  });

  it('não perde centavos em valores que quebram em float', () => {
    expect(formatBRL(1)).toBe(`R$${NBSP}0,01`);
    expect(formatBRL(1999)).toBe(`R$${NBSP}19,99`);
  });
});

describe('toAmount', () => {
  it('converte centavos para o decimal que o Mercado Pago espera', () => {
    expect(toAmount(2990)).toBe(29.9);
    expect(toAmount(100)).toBe(1);
  });

  it('mantém o valor exato do produto', () => {
    // Se isto quebrar, o valor cobrado diverge do exibido — estorno na certa.
    expect(toAmount(PRODUCT.priceInCents)).toBe(29.9);
  });
});

describe('DISCOUNT_IN_CENTS', () => {
  it('é a diferença entre preço de lista e preço final', () => {
    expect(DISCOUNT_IN_CENTS).toBe(1000);
    expect(PRODUCT.listPriceInCents - DISCOUNT_IN_CENTS).toBe(
      PRODUCT.priceInCents
    );
  });

  it('nunca é negativo', () => {
    expect(DISCOUNT_IN_CENTS).toBeGreaterThanOrEqual(0);
  });
});

describe('PRODUCT', () => {
  it('mantém os preços em centavos inteiros', () => {
    // Centavo fracionário aqui vira erro de arredondamento no gateway.
    expect(Number.isInteger(PRODUCT.priceInCents)).toBe(true);
    expect(Number.isInteger(PRODUCT.listPriceInCents)).toBe(true);
  });

  it('não cobra mais que o preço de lista', () => {
    expect(PRODUCT.priceInCents).toBeLessThanOrEqual(PRODUCT.listPriceInCents);
  });
});
