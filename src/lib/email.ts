import { Resend } from 'resend';

import { env } from '@/lib/env';
import { PRODUCT } from '@/lib/product';

/**
 * E-mail transacional de entrega, via Resend.
 *
 * ⚠️ PONTO DE INTEGRAÇÃO — além de RESEND_API_KEY, é preciso VERIFICAR O
 * DOMÍNIO no painel do Resend. Sem domínio verificado o envio só funciona para
 * o e-mail da própria conta, e em produção a entrega falha silenciosamente.
 */

let cached: Resend | null = null;

function client(): Resend {
  cached ??= new Resend(env.resendApiKey);
  return cached;
}

export type DeliveryEmail = {
  to: string;
  customerName: string;
  downloadUrl: string;
};

export type SendResult =
  { sent: true; id: string } | { sent: false; error: string };

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? '';
}

export async function sendDownloadEmail(
  input: DeliveryEmail
): Promise<SendResult> {
  const nome = firstName(input.customerName);

  try {
    const { data, error } = await client().emails.send({
      from: env.emailFrom,
      to: input.to,
      subject: `Seu guia chegou, ${nome}! 🍼`,
      text: [
        `Oi, ${nome}!`,
        '',
        `Seu pagamento foi confirmado e o ${PRODUCT.name} já é seu.`,
        '',
        `Baixe aqui: ${input.downloadUrl}`,
        '',
        'O link vale por 7 dias. Salve o PDF no celular para consultar de',
        'madrugada, que é quando ele mais serve.',
        '',
        'Qualquer dúvida, é só responder este e-mail.',
      ].join('\n'),
      html: deliveryHtml(nome, input.downloadUrl),
    });

    if (error) return { sent: false, error: error.message };
    return { sent: true, id: data?.id ?? '' };
  } catch (cause) {
    return {
      sent: false,
      error: cause instanceof Error ? cause.message : 'erro desconhecido',
    };
  }
}

function deliveryHtml(nome: string, url: string): string {
  // HTML de e-mail é tabela e estilo inline de propósito: clientes de e-mail
  // ignoram <style> em <head> e não entendem flex/grid.
  return `<!doctype html>
<html lang="pt-BR"><body style="margin:0;padding:0;background:#FBF3E7;font-family:Helvetica,Arial,sans-serif;color:#2A211B">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF3E7;padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:18px;padding:40px 32px">
<tr><td>
<p style="margin:0 0 8px;font-size:14px;letter-spacing:.12em;text-transform:uppercase;color:#C97C3D;font-weight:700">Pagamento confirmado</p>
<h1 style="margin:0 0 16px;font-size:26px;line-height:1.2;color:#1B2436">Oi, ${escapeHtml(nome)}. Seu guia chegou.</h1>
<p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:rgba(42,33,27,.75)">
Tudo certo com o pagamento. O <strong>${escapeHtml(PRODUCT.name)}</strong> está pronto para download.
</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px">
<tr><td style="border-radius:999px;background:#E8A659">
<a href="${escapeHtml(url)}" style="display:inline-block;padding:16px 32px;font-size:16px;font-weight:700;color:#221407;text-decoration:none">Baixar meu guia</a>
</td></tr></table>
<p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:rgba(42,33,27,.65)">
O link vale por <strong>7 dias</strong>. Salve o PDF no celular — ele serve mais às 3 da manhã do que no sofá.
</p>
<p style="margin:24px 0 0;padding-top:20px;border-top:1px solid rgba(42,33,27,.1);font-size:12px;line-height:1.6;color:rgba(42,33,27,.55)">
Este material é educativo e informativo. Não substitui consulta médica nem acompanhamento profissional de saúde. Consulte sempre o pediatra do seu bebê.
</p>
</td></tr></table>
</td></tr></table>
</body></html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
