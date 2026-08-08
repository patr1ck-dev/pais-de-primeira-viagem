import { Icon } from '@/components/ui';
import { LEGAL_NOTE_SHORT } from '@/lib/content';
import { DISCOUNT_IN_CENTS, formatBRL, PRODUCT } from '@/lib/product';

const TRUST = [
  { icon: 'shield', label: 'Pagamento processado com segurança' },
  { icon: 'phone', label: 'Acesso liberado no seu e-mail em minutos' },
  {
    icon: 'lock',
    label: `Garantia incondicional de ${PRODUCT.guaranteeDays} dias`,
  },
] as const;

export function OrderSummary() {
  return (
    <div>
      <div className="bg-surface-raised border-line rounded-[18px] border p-7 lg:sticky lg:top-6">
        <div className="border-line mb-[22px] flex items-center gap-3.5 border-b pb-[22px]">
          <div
            className="border-line font-heading text-accent flex h-[66px] w-[52px] shrink-0 items-center justify-center rounded-lg border text-center text-[0.7rem] font-extrabold"
            style={{
              background:
                'linear-gradient(160deg, var(--surface-raised-2), var(--surface-2))',
            }}
          >
            PDF
            <br />
            GUIA
          </div>
          <div>
            <h2 className="font-body mb-1 text-[0.92rem] font-semibold">
              {PRODUCT.name}
            </h2>
            <p className="text-muted text-[0.78rem]">{PRODUCT.description}</p>
          </div>
        </div>

        <div className="text-muted mb-2.5 flex justify-between text-[0.9rem]">
          <span>Guia digital</span>
          <span>{formatBRL(PRODUCT.listPriceInCents)}</span>
        </div>
        <div className="text-muted mb-2.5 flex justify-between text-[0.9rem]">
          <span>Desconto de lançamento</span>
          <span className="text-accent">- {formatBRL(DISCOUNT_IN_CENTS)}</span>
        </div>
        <div className="border-line mt-1.5 flex justify-between border-t pt-3.5 text-[1.1rem] font-bold">
          <span>Total</span>
          <span className="font-heading text-accent font-extrabold">
            {formatBRL(PRODUCT.priceInCents)}
          </span>
        </div>

        <ul className="mt-6 flex flex-col gap-2.5">
          {TRUST.map((item) => (
            <li
              key={item.label}
              className="text-muted flex items-center gap-2.5 text-[0.82rem]"
            >
              <Icon
                name={item.icon}
                strokeWidth={2}
                className="text-accent size-[15px] shrink-0"
              />
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-faint mt-5 text-[0.74rem] leading-[1.6]">
        ⚠️ {LEGAL_NOTE_SHORT}
      </p>
    </div>
  );
}
