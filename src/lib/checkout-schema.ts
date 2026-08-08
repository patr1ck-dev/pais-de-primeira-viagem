import { z } from 'zod';

/**
 * Contrato de entrada de /api/checkout.
 *
 * Repare no que NÃO está aqui: valor. O preço vem sempre de
 * PRODUCT.priceInCents no servidor. Aceitar valor do cliente é deixar o
 * comprador escolher quanto pagar — o bug clássico de checkout próprio.
 */

const nameSchema = z
  .string()
  .trim()
  .min(2, 'Informe seu nome completo.')
  .max(120, 'Nome muito longo.');

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Informe seu e-mail.')
  .max(254, 'E-mail muito longo.')
  .email('E-mail inválido.');

/** Opcional: string vazia vira undefined em vez de falhar a validação. */
const whatsappSchema = z
  .string()
  .trim()
  .transform((value) => (value === '' ? undefined : value))
  .pipe(
    z
      .string()
      .regex(/^[\d\s()+-]{10,20}$/, 'WhatsApp inválido.')
      .optional()
  )
  .optional();

const buyerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  whatsapp: whatsappSchema,
});

const pixSchema = buyerSchema.extend({
  method: z.literal('pix'),
});

/**
 * No cartão o servidor recebe apenas o TOKEN gerado pelo Brick no navegador.
 * O número do cartão nunca chega aqui — é o que mantém o projeto fora do
 * escopo do PCI-DSS.
 */
const cardSchema = buyerSchema.extend({
  method: z.literal('card'),
  token: z.string().min(1, 'Token do cartão ausente.'),
  paymentMethodId: z.string().min(1),
  installments: z.number().int().min(1).max(12),
  issuerId: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
});

export const checkoutRequestSchema = z.discriminatedUnion('method', [
  pixSchema,
  cardSchema,
]);

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
export type PixCheckoutRequest = z.infer<typeof pixSchema>;
export type CardCheckoutRequest = z.infer<typeof cardSchema>;

/** Resposta do Pix: o que a UI precisa para exibir o QR e o copia-e-cola. */
export type PixCheckoutResponse = {
  method: 'pix';
  paymentId: string;
  status: string;
  qrCodeBase64: string | null;
  qrCode: string | null;
  ticketUrl: string | null;
  expiresAt: string | null;
};

export type CardCheckoutResponse = {
  method: 'card';
  paymentId: string;
  status: string;
  statusDetail: string;
};

export type CheckoutResponse = PixCheckoutResponse | CardCheckoutResponse;

export type CheckoutErrorResponse = {
  error: string;
  message: string;
  /** Erros por campo, quando a falha é de validação. */
  fields?: Record<string, string[]>;
};

/** Divide "Maria Silva Santos" em first/last para o payer do Mercado Pago. */
export function splitName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? '';
  const lastName = parts.slice(1).join(' ');
  return { firstName, lastName };
}
