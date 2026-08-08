import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { env, isPaymentConfigured } from './env';

const ORIGINAL = { ...process.env };

beforeEach(() => {
  delete process.env.MERCADOPAGO_ACCESS_TOKEN;
  delete process.env.DOWNLOAD_TOKEN_SECRET;
  delete process.env.NEXT_PUBLIC_SITE_URL;
});

afterEach(() => {
  process.env = { ...ORIGINAL };
});

describe('env', () => {
  it('falha alto quando a chave não está configurada', () => {
    // O objetivo é quebrar na rota que precisa da chave, não no import —
    // é isso que deixa as Fases 1 a 3 buildarem sem credencial.
    expect(() => env.mercadoPagoAccessToken).toThrow(
      /MERCADOPAGO_ACCESS_TOKEN/
    );
  });

  it('trata string vazia como ausente', () => {
    process.env.DOWNLOAD_TOKEN_SECRET = '';
    expect(() => env.downloadTokenSecret).toThrow(/DOWNLOAD_TOKEN_SECRET/);
  });

  it('devolve o valor quando configurado', () => {
    process.env.DOWNLOAD_TOKEN_SECRET = 'segredo-de-teste';
    expect(env.downloadTokenSecret).toBe('segredo-de-teste');
  });
});

describe('env.siteUrl', () => {
  it('remove a barra final para não gerar URL com //', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://exemplo.com.br/';
    expect(env.siteUrl).toBe('https://exemplo.com.br');
  });

  it('preserva URL sem barra final', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://exemplo.com.br';
    expect(env.siteUrl).toBe('https://exemplo.com.br');
  });

  it('cai para localhost quando não configurada', () => {
    expect(env.siteUrl).toBe('http://localhost:3000');
  });
});

describe('isPaymentConfigured', () => {
  it('é falso sem credencial do Mercado Pago', () => {
    expect(isPaymentConfigured()).toBe(false);
  });

  it('é verdadeiro com credencial presente', () => {
    process.env.MERCADOPAGO_ACCESS_TOKEN = 'TEST-123';
    expect(isPaymentConfigured()).toBe(true);
  });
});
