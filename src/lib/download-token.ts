/**
 * Token de download assinado com HMAC.
 *
 * ⚠️ PONTO DE INTEGRAÇÃO — Fase 5.
 * Depende só de DOWNLOAD_TOKEN_SECRET (nenhum serviço externo). Substitui o
 * banco de dados: o payload carrega e-mail + expiração e a assinatura garante
 * que ninguém forjou nem editou o link.
 *
 * Na implementação: comparar assinaturas com timingSafeEqual, nunca com `===`,
 * para não vazar o segredo por tempo de resposta.
 */

// import { env } from '@/lib/env';

export type DownloadTokenPayload = {
  email: string;
  paymentId: string;
  /** Unix epoch em segundos. */
  expiresAt: number;
};

export function createDownloadToken(_payload: DownloadTokenPayload): never {
  throw new Error('Geração de token é implementada na Fase 5.');
}

export function verifyDownloadToken(_token: string): never {
  throw new Error('Validação de token é implementada na Fase 5.');
}
