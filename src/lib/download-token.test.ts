import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  createDownloadToken,
  DOWNLOAD_TTL_SECONDS,
  verifyDownloadToken,
} from './download-token';

const ORIGINAL = { ...process.env };
const payload = { email: 'maria@exemplo.com.br', paymentId: '123456789' };

beforeEach(() => {
  process.env.DOWNLOAD_TOKEN_SECRET = 'segredo-de-teste-nao-usar-em-producao';
});

afterEach(() => {
  process.env = { ...ORIGINAL };
});

describe('ida e volta', () => {
  it('valida um token recém-criado e devolve o payload', () => {
    const result = verifyDownloadToken(createDownloadToken(payload));
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.payload.email).toBe(payload.email);
      expect(result.payload.paymentId).toBe(payload.paymentId);
    }
  });

  it('é determinístico para a mesma expiração', () => {
    // Importa para o reenvio do webhook não gerar link diferente do primeiro.
    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    expect(createDownloadToken({ ...payload, expiresAt })).toBe(
      createDownloadToken({ ...payload, expiresAt })
    );
  });

  it('usa TTL de 7 dias por padrão', () => {
    const antes = Math.floor(Date.now() / 1000);
    const result = verifyDownloadToken(createDownloadToken(payload));
    expect(result.valid).toBe(true);
    if (result.valid) {
      const delta = result.payload.expiresAt - antes;
      expect(delta).toBeGreaterThan(DOWNLOAD_TTL_SECONDS - 5);
      expect(delta).toBeLessThanOrEqual(DOWNLOAD_TTL_SECONDS + 5);
    }
  });
});

describe('expiração', () => {
  it('recusa token vencido', () => {
    const token = createDownloadToken({
      ...payload,
      expiresAt: Math.floor(Date.now() / 1000) - 1,
    });
    const result = verifyDownloadToken(token);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe('expired');
  });

  it('aceita token que ainda tem folga', () => {
    const token = createDownloadToken({
      ...payload,
      expiresAt: Math.floor(Date.now() / 1000) + 60,
    });
    expect(verifyDownloadToken(token).valid).toBe(true);
  });
});

describe('adulteração', () => {
  it('recusa payload editado sem reassinar', () => {
    // O ataque óbvio: trocar a data de expiração e manter a assinatura.
    const token = createDownloadToken(payload);
    const [, signature] = token.split('.');
    const forjado = Buffer.from(
      JSON.stringify({
        ...payload,
        expiresAt: Math.floor(Date.now() / 1000) + 999_999,
      })
    ).toString('base64url');

    const result = verifyDownloadToken(`${forjado}.${signature ?? ''}`);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe('bad_signature');
  });

  it('recusa assinatura de outro segredo', () => {
    const token = createDownloadToken(payload);
    process.env.DOWNLOAD_TOKEN_SECRET = 'outro-segredo-completamente-diferente';
    const result = verifyDownloadToken(token);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe('bad_signature');
  });

  it('recusa token de outro pagamento com assinatura reaproveitada', () => {
    const a = createDownloadToken(payload);
    const b = createDownloadToken({ ...payload, paymentId: '999999999' });
    const [payloadA] = a.split('.');
    const [, assinaturaB] = b.split('.');
    expect(
      verifyDownloadToken(`${payloadA ?? ''}.${assinaturaB ?? ''}`).valid
    ).toBe(false);
  });

  it('recusa formatos quebrados', () => {
    for (const invalido of [
      '',
      'semponto',
      'a.b.c',
      '.',
      'eyJhIjoxfQ.',
      '.assinatura',
    ]) {
      expect(verifyDownloadToken(invalido).valid).toBe(false);
    }
  });

  it('não estoura com base64 inválido no payload', () => {
    expect(() => verifyDownloadToken('!!!nao-e-base64!!!.xxx')).not.toThrow();
  });
});

describe('configuração', () => {
  it('falha alto se o segredo não estiver definido', () => {
    delete process.env.DOWNLOAD_TOKEN_SECRET;
    expect(() => createDownloadToken(payload)).toThrow(/DOWNLOAD_TOKEN_SECRET/);
  });
});
