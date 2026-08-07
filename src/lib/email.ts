/**
 * Disparo de e-mail transacional via Resend.
 *
 * ⚠️ PONTO DE INTEGRAÇÃO — Fase 5.
 * Preencher RESEND_API_KEY e verificar o domínio remetente no painel do Resend.
 */

// import { Resend } from 'resend';
// import { env } from '@/lib/env';

export type DeliveryEmail = {
  to: string;
  customerName: string;
  downloadUrl: string;
};

export function sendDownloadEmail(_input: DeliveryEmail): never {
  throw new Error('Envio de e-mail é implementado na Fase 5.');
}
