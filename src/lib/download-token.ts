import { createHmac, timingSafeEqual } from 'node:crypto';

import { env } from '@/lib/env';

/**
 * Token de download assinado com HMAC-SHA256.
 *
 * Substitui o banco de dados: o payload carrega e-mail, pagamento e validade,
 * e a assinatura garante que ninguém forjou nem editou o link. O servidor não
 * precisa lembrar de nada — a verdade viaja dentro do próprio token.
 *
 * Formato: base64url(payload JSON) + "." + base64url(HMAC do payload)
 */

export type DownloadTokenPayload = {
  email: string;
  paymentId: string;
  /** Unix epoch em SEGUNDOS. */
  expiresAt: number;
};

export const DOWNLOAD_TTL_SECONDS = 7 * 24 * 60 * 60;

export type VerifyResult =
  | { valid: true; payload: DownloadTokenPayload }
  | { valid: false; reason: 'malformed' | 'bad_signature' | 'expired' };

function b64urlEncode(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64url');
}

function sign(encodedPayload: string): string {
  return createHmac('sha256', env.downloadTokenSecret)
    .update(encodedPayload)
    .digest('base64url');
}

export function createDownloadToken(
  payload: Omit<DownloadTokenPayload, 'expiresAt'> & { expiresAt?: number }
): string {
  const expiresAt =
    payload.expiresAt ?? Math.floor(Date.now() / 1000) + DOWNLOAD_TTL_SECONDS;

  const body: DownloadTokenPayload = {
    email: payload.email,
    paymentId: payload.paymentId,
    expiresAt,
  };

  const encoded = b64urlEncode(JSON.stringify(body));
  return `${encoded}.${sign(encoded)}`;
}

export function verifyDownloadToken(token: string): VerifyResult {
  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false, reason: 'malformed' };

  const [encoded, signature] = parts;
  if (!encoded || !signature) return { valid: false, reason: 'malformed' };

  const expected = sign(encoded);

  // Comparação em tempo constante: `===` vaza o segredo pelo tempo de
  // resposta, porque para de comparar no primeiro byte diferente.
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { valid: false, reason: 'bad_signature' };
  }

  // Só depois de a assinatura conferir é que o payload merece confiança.
  let payload: DownloadTokenPayload;
  try {
    const parsed: unknown = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8')
    );
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof (parsed as DownloadTokenPayload).email !== 'string' ||
      typeof (parsed as DownloadTokenPayload).paymentId !== 'string' ||
      typeof (parsed as DownloadTokenPayload).expiresAt !== 'number'
    ) {
      return { valid: false, reason: 'malformed' };
    }
    payload = parsed as DownloadTokenPayload;
  } catch {
    return { valid: false, reason: 'malformed' };
  }

  if (payload.expiresAt * 1000 <= Date.now()) {
    return { valid: false, reason: 'expired' };
  }

  return { valid: true, payload };
}

/** URL completa de download, para o e-mail e a página de obrigado. */
export function downloadUrlFor(payload: {
  email: string;
  paymentId: string;
}): string {
  return `${env.siteUrl}/download/${createDownloadToken(payload)}`;
}
