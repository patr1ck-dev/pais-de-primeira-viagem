'use client';

import { useId, useState } from 'react';

import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';
import { formatBRL, PRODUCT } from '@/lib/product';
import { PixQrCode } from './PixQrCode';

export type PaymentMethod = 'pix' | 'card';

const METHODS: readonly { id: PaymentMethod; label: string }[] = [
  { id: 'pix', label: 'Pix' },
  { id: 'card', label: 'Cartão' },
];

function Field({
  label,
  id,
  ...props
}: {
  label: string;
  id: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
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
        className="bg-surface-2 border-line text-content focus:border-accent placeholder:text-faint w-full rounded-[10px] border px-3.5 py-[13px] text-[0.95rem] transition-colors outline-none"
        {...props}
      />
    </div>
  );
}

export function PaymentForm() {
  const [method, setMethod] = useState<PaymentMethod>('pix');
  const ids = useId();

  return (
    <div className="bg-surface-raised border-line rounded-[18px] border p-6 sm:p-8">
      <h2 className="mb-[22px] text-[1.2rem]">Seus dados</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          // ⚠️ PONTO DE INTEGRAÇÃO — Fase 4: POST para /api/checkout.
        }}
      >
        <Field
          id={`${ids}-nome`}
          label="Nome completo"
          type="text"
          name="nome"
          autoComplete="name"
          required
          placeholder="Como você quer ser chamado(a)"
        />
        <Field
          id={`${ids}-email`}
          label="E-mail"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="seuemail@exemplo.com"
        />
        <Field
          id={`${ids}-whats`}
          label="WhatsApp (opcional)"
          type="tel"
          name="whatsapp"
          autoComplete="tel"
          placeholder="(00) 00000-0000"
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
              onClick={() => {
                setMethod(item.id);
              }}
              className={cn(
                'min-w-[120px] flex-1 cursor-pointer rounded-[10px] border-[1.5px] px-2.5 py-[13px] text-center text-[0.85rem] font-semibold transition-colors',
                method === item.id
                  ? 'border-accent text-accent bg-accent-soft'
                  : 'border-line bg-surface-2 text-muted'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {method === 'card' && (
          <div className="grid gap-3.5 sm:grid-cols-2">
            <Field
              id={`${ids}-cartao`}
              label="Número do cartão"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="0000 0000 0000 0000"
            />
            <Field
              id={`${ids}-validade`}
              label="Validade"
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/AA"
            />
          </div>
        )}

        {method === 'pix' && <PixQrCode />}

        <Button type="submit" fullWidth className="mt-2">
          Pagar {formatBRL(PRODUCT.priceInCents)} e receber agora
        </Button>
      </form>
    </div>
  );
}
