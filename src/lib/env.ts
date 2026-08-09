/**
 * Acesso às variáveis de ambiente.
 *
 * A leitura é preguiçosa de propósito. Se validássemos tudo no import, as
 * Fases 1 a 3 parariam de buildar enquanto as credenciais do Mercado Pago não
 * chegam — e o requisito é que a landing suba sem depender de nada externo.
 * Cada rota que precisa de uma chave chama o getter e falha só ali.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variável de ambiente ausente: ${name}. ` +
        `Copie .env.example para .env.local e preencha (ou configure na Vercel).`
    );
  }
  return value;
}

export const env = {
  get mercadoPagoAccessToken(): string {
    return required('MERCADOPAGO_ACCESS_TOKEN');
  },
  get mercadoPagoPublicKey(): string {
    return required('MERCADOPAGO_PUBLIC_KEY');
  },
  /** Segredo da assinatura de webhook, do painel do Mercado Pago. */
  get mercadoPagoWebhookSecret(): string {
    return required('MERCADOPAGO_WEBHOOK_SECRET');
  },
  get resendApiKey(): string {
    return required('RESEND_API_KEY');
  },
  /** Remetente verificado no Resend. */
  get emailFrom(): string {
    return (
      process.env.EMAIL_FROM ??
      'Pais de Primeira Viagem <onboarding@resend.dev>'
    );
  },
  get downloadTokenSecret(): string {
    return required('DOWNLOAD_TOKEN_SECRET');
  },
  get siteUrl(): string {
    return (
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
      'http://localhost:3000'
    );
  },
} as const;

/** Permite a UI esconder o fluxo de pagamento enquanto não há credencial. */
export function isPaymentConfigured(): boolean {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);
}
