'use client';

import { useId, useState } from 'react';
import type { InputHTMLAttributes } from 'react';

import { Button } from '@/components/ui';
import type {
  CheckoutErrorResponse,
  CheckoutResponse,
  PixCheckoutResponse,
} from '@/lib/checkout-schema';
import { cn } from '@/lib/cn';
import { formatBRL, PRODUCT, toAmount } from '@/lib/product';
import { CardBrick, CardUnavailable } from './CardBrick';
import type { CardBrickSubmitData } from './CardBrick';
import { PixPlaceholder, PixQrCode } from './PixQrCode';

export type PaymentMethod = 'pix' | 'card';

const METHODS: readonly { id: PaymentMethod; label: string }[] = [
  { id: 'pix', label: 'Pix' },
  { id: 'card', label: 'Cartão' },
];

function Field({
  label,
  id,
  error,
  ...props
}: {
  label: string;
  id: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mb-[18px]">
      <label
        htmlFor={id}
        className="text-muted mb-[7px] block text-[0.82rem] font-semibold"
      >
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-erro` : undefined}
        className={cn(
          'bg-surface-2 text-content placeholder:text-faint w-full rounded-[10px] border px-3.5 py-[13px] text-[0.95rem] transition-colors outline-none',
          error ? 'border-red-500' : 'border-line focus:border-accent'
        )}
        {...props}
      />
      {error && (
        <p id={`${id}-erro`} className="mt-1.5 text-[0.78rem] text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

type Status =
  'idle' | 'loading' | 'pix-ready' | 'card-approved' | 'card-review';

type PaymentFormProps = {
  /** Vem do servidor; null enquanto as credenciais não estiverem configuradas. */
  mercadoPagoPublicKey: string | null;
};

export function PaymentForm({ mercadoPagoPublicKey }: PaymentFormProps) {
  const ids = useId();

  const [method, setMethod] = useState<PaymentMethod>('pix');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const [status, setStatus] = useState<Status>('idle');
  const [pix, setPix] = useState<PixCheckoutResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const loading = status === 'loading';

  /** Valida no cliente só para dar retorno rápido — o servidor revalida tudo. */
  function validateBuyer(): boolean {
    const errors: Record<string, string> = {};
    if (name.trim().length < 2) errors.name = 'Informe seu nome completo.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()))
      errors.email = 'Informe um e-mail válido.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function send(body: Record<string, unknown>): Promise<void> {
    setFormError(null);
    setStatus('loading');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          whatsapp: whatsapp || undefined,
          ...body,
        }),
      });

      const payload = (await response.json()) as
        CheckoutResponse | CheckoutErrorResponse;

      if (!response.ok) {
        const error = payload as CheckoutErrorResponse;
        setFormError(error.message || 'Não foi possível iniciar o pagamento.');
        setStatus('idle');
        return;
      }

      const result = payload as CheckoutResponse;

      if (result.method === 'pix') {
        setPix(result);
        setStatus('pix-ready');
        return;
      }

      // Cartão: `approved` libera na hora; o resto depende do webhook (Fase 5).
      setStatus(result.status === 'approved' ? 'card-approved' : 'card-review');
    } catch {
      setFormError('Falha de conexão. Verifique sua internet e tente de novo.');
      setStatus('idle');
    }
  }

  async function handleCardSubmit(card: CardBrickSubmitData): Promise<void> {
    if (!validateBuyer()) {
      setFormError('Preencha seu nome e e-mail antes de pagar.');
      return;
    }
    await send({ method: 'card', ...card });
  }

  if (status === 'card-approved') {
    return (
      <div className="bg-surface-raised border-line rounded-[18px] border p-6 text-center sm:p-8">
        <h2 className="text-accent mb-3 text-[1.2rem]">Pagamento aprovado</h2>
        <p className="text-muted text-[0.92rem]">
          Enviamos o guia para <strong className="text-content">{email}</strong>
          . Se não aparecer em alguns minutos, confira a caixa de spam.
        </p>
      </div>
    );
  }

  if (status === 'card-review') {
    return (
      <div className="bg-surface-raised border-line rounded-[18px] border p-6 text-center sm:p-8">
        <h2 className="mb-3 text-[1.2rem]">Pagamento em análise</h2>
        <p className="text-muted text-[0.92rem]">
          O banco está confirmando a transação. Assim que for aprovada, o guia
          chega em <strong className="text-content">{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-raised border-line rounded-[18px] border p-6 sm:p-8">
      <h2 className="mb-[22px] text-[1.2rem]">Seus dados</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!validateBuyer()) return;
          void send({ method: 'pix' });
        }}
      >
        <Field
          id={`${ids}-nome`}
          label="Nome completo"
          type="text"
          name="nome"
          autoComplete="name"
          required
          disabled={loading || status === 'pix-ready'}
          placeholder="Como você quer ser chamado(a)"
          value={name}
          error={fieldErrors.name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Field
          id={`${ids}-email`}
          label="E-mail"
          type="email"
          name="email"
          autoComplete="email"
          required
          disabled={loading || status === 'pix-ready'}
          placeholder="seuemail@exemplo.com"
          value={email}
          error={fieldErrors.email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <Field
          id={`${ids}-whats`}
          label="WhatsApp (opcional)"
          type="tel"
          name="whatsapp"
          autoComplete="tel"
          disabled={loading || status === 'pix-ready'}
          placeholder="(00) 00000-0000"
          value={whatsapp}
          onChange={(e) => {
            setWhatsapp(e.target.value);
          }}
        />

        <h2 className="mt-[30px] mb-[22px] text-[1.2rem]">
          Forma de pagamento
        </h2>

        {/* radiogroup em vez das <div> clicáveis do protótipo: o método de
            pagamento precisa ser alcançável por teclado e anunciado por leitor
            de tela. */}
        <div
          role="radiogroup"
          aria-label="Forma de pagamento"
          className="mb-[22px] flex flex-wrap gap-2.5"
        >
          {METHODS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={method === item.id}
              disabled={loading || status === 'pix-ready'}
              onClick={() => {
                setMethod(item.id);
                setFormError(null);
              }}
              className={cn(
                'min-w-[120px] flex-1 cursor-pointer rounded-[10px] border-[1.5px] px-2.5 py-[13px] text-center text-[0.85rem] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
                method === item.id
                  ? 'border-accent text-accent bg-accent-soft'
                  : 'border-line bg-surface-2 text-muted'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {method === 'pix' &&
          (pix ? <PixQrCode pix={pix} /> : <PixPlaceholder />)}

        {method === 'card' &&
          (mercadoPagoPublicKey ? (
            <CardBrick
              publicKey={mercadoPagoPublicKey}
              amount={toAmount(PRODUCT.priceInCents)}
              onSubmit={handleCardSubmit}
              onError={setFormError}
            />
          ) : (
            <CardUnavailable />
          ))}

        {formError && (
          <p
            role="alert"
            className="border-line bg-surface-2 mb-4 rounded-[10px] border px-3.5 py-3 text-[0.85rem] text-red-400"
          >
            {formError}
          </p>
        )}

        {/* No cartão quem envia é o botão do próprio Brick — ter dois botões
            de pagamento na tela confunde e gera cobrança duplicada. */}
        {method === 'pix' && status !== 'pix-ready' && (
          <Button type="submit" fullWidth disabled={loading} className="mt-2">
            {loading
              ? 'Gerando cobrança…'
              : `Pagar ${formatBRL(PRODUCT.priceInCents)} e receber agora`}
          </Button>
        )}
      </form>
    </div>
  );
}
