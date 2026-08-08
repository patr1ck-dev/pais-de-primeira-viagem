import { Badge, Button, Reveal } from '@/components/ui';
import { GuaranteeRow } from '@/components/ui/GuaranteeRow';
import { LEGAL_NOTE } from '@/lib/content';
import { formatBRL, PRODUCT } from '@/lib/product';

export function Pricing() {
  return (
    <section
      id="comprar"
      className="py-[100px]"
      style={{
        background:
          'linear-gradient(160deg, var(--accent) 0%, var(--accent-strong) 100%)',
      }}
    >
      <div className="max-w-site mx-auto px-6">
        <Reveal
          className="bg-surface mx-auto max-w-[820px] rounded-[28px] px-6 py-10 text-center sm:px-14 sm:py-14"
          style={{ boxShadow: '0 30px 60px -30px rgba(36,22,8,0.5)' }}
        >
          <Badge tone="accent-alt">
            Garantia de {PRODUCT.guaranteeDays} dias
          </Badge>
          <h2 className="mt-5 mb-3 text-[clamp(1.8rem,3vw,2.4rem)]">
            Comece agora com confiança
          </h2>
          <p className="text-muted mx-auto mb-8 max-w-[48ch] text-[clamp(1.05rem,1.5vw,1.2rem)]">
            Este guia foi criado para que você curta cada momento com seu bebê —
            sem ansiedade, sem medo, com todo o amor do mundo.
          </p>

          <div className="mb-2 flex items-baseline justify-center gap-2">
            <span className="text-muted text-base">a partir de</span>
            <span className="font-heading text-content text-[3rem] font-semibold">
              {formatBRL(PRODUCT.priceInCents)}
            </span>
          </div>
          <p className="text-muted mb-[34px] text-[0.85rem]">
            Menos do que uma consulta. Conhecimento que você carrega pelos
            próximos anos.
          </p>

          <Button href="/produto" className="mx-auto w-full max-w-[360px]">
            Quero garantir meu guia agora
          </Button>

          <GuaranteeRow className="mt-[34px]" />

          <p className="text-muted border-line mt-9 border-t pt-5 text-[0.78rem] leading-[1.6]">
            ⚠️ {LEGAL_NOTE}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
