import { describe, expect, it } from 'vitest';

import { checkoutRequestSchema, splitName } from './checkout-schema';

const buyer = {
  name: 'Maria Silva',
  email: 'maria@exemplo.com.br',
};

describe('checkoutRequestSchema — Pix', () => {
  it('aceita o mínimo: nome, e-mail e método', () => {
    const result = checkoutRequestSchema.safeParse({ ...buyer, method: 'pix' });
    expect(result.success).toBe(true);
  });

  it('normaliza e-mail para minúsculas e sem espaços', () => {
    const result = checkoutRequestSchema.safeParse({
      ...buyer,
      email: '  Maria@Exemplo.COM.BR  ',
      method: 'pix',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('maria@exemplo.com.br');
    }
  });

  it('rejeita e-mail inválido', () => {
    const result = checkoutRequestSchema.safeParse({
      ...buyer,
      email: 'maria@',
      method: 'pix',
    });
    expect(result.success).toBe(false);
  });

  it('rejeita nome com menos de dois caracteres', () => {
    const result = checkoutRequestSchema.safeParse({
      ...buyer,
      name: 'M',
      method: 'pix',
    });
    expect(result.success).toBe(false);
  });

  it('trata WhatsApp vazio como ausente, não como inválido', () => {
    const result = checkoutRequestSchema.safeParse({
      ...buyer,
      whatsapp: '',
      method: 'pix',
    });
    expect(result.success).toBe(true);
  });

  it('aceita WhatsApp formatado', () => {
    const result = checkoutRequestSchema.safeParse({
      ...buyer,
      whatsapp: '(11) 98888-7777',
      method: 'pix',
    });
    expect(result.success).toBe(true);
  });
});

describe('checkoutRequestSchema — proteção de preço', () => {
  it('ignora qualquer valor enviado pelo cliente', () => {
    // O comprador não pode escolher quanto paga: o schema nem carrega o campo.
    const result = checkoutRequestSchema.safeParse({
      ...buyer,
      method: 'pix',
      transaction_amount: 0.01,
      amount: 1,
      price: 1,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty('transaction_amount');
      expect(result.data).not.toHaveProperty('amount');
      expect(result.data).not.toHaveProperty('price');
    }
  });
});

describe('checkoutRequestSchema — cartão', () => {
  const card = {
    ...buyer,
    method: 'card' as const,
    token: 'tok_123',
    paymentMethodId: 'visa',
    installments: 1,
  };

  it('aceita o payload que o Brick produz', () => {
    expect(checkoutRequestSchema.safeParse(card).success).toBe(true);
  });

  it('exige token — sem ele não há como cobrar', () => {
    const { token: _token, ...semToken } = card;
    expect(checkoutRequestSchema.safeParse(semToken).success).toBe(false);
  });

  it('rejeita token vazio', () => {
    expect(
      checkoutRequestSchema.safeParse({ ...card, token: '' }).success
    ).toBe(false);
  });

  it('recusa parcelas fora de 1..12', () => {
    expect(
      checkoutRequestSchema.safeParse({ ...card, installments: 0 }).success
    ).toBe(false);
    expect(
      checkoutRequestSchema.safeParse({ ...card, installments: 13 }).success
    ).toBe(false);
    expect(
      checkoutRequestSchema.safeParse({ ...card, installments: 1.5 }).success
    ).toBe(false);
  });

  it('nunca aceita número de cartão cru', () => {
    // Dado de cartão não pode chegar ao servidor — é o que mantém o projeto
    // fora do escopo PCI-DSS.
    const result = checkoutRequestSchema.safeParse({
      ...card,
      cardNumber: '4111111111111111',
      securityCode: '123',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty('cardNumber');
      expect(result.data).not.toHaveProperty('securityCode');
    }
  });
});

describe('checkoutRequestSchema — método', () => {
  it('rejeita método desconhecido', () => {
    expect(
      checkoutRequestSchema.safeParse({ ...buyer, method: 'boleto' }).success
    ).toBe(false);
  });

  it('rejeita corpo sem método', () => {
    expect(checkoutRequestSchema.safeParse(buyer).success).toBe(false);
  });
});

describe('splitName', () => {
  it('separa primeiro nome e sobrenome', () => {
    expect(splitName('Maria Silva Santos')).toEqual({
      firstName: 'Maria',
      lastName: 'Silva Santos',
    });
  });

  it('lida com nome único sem quebrar', () => {
    expect(splitName('Maria')).toEqual({ firstName: 'Maria', lastName: '' });
  });

  it('ignora espaços extras', () => {
    expect(splitName('  Maria   Silva  ')).toEqual({
      firstName: 'Maria',
      lastName: 'Silva',
    });
  });
});
