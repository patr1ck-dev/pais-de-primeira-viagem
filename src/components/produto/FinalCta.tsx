import { Badge, Button, Reveal } from '@/components/ui';
import { FaqList } from '@/components/ui/FaqList';
import { GuaranteeRow } from '@/components/ui/GuaranteeRow';
import { SectionHead } from '@/components/ui';
import { LEGAL_NOTE } from '@/lib/content';
import { formatBRL, PRODUCT } from '@/lib/product';

export function ProdutoFaq() {
  return (
    <section className="bg-surface-2 py-24">
      <div className="max-w-site mx-auto px-6">
        <SectionHead
          eyebrow="Perguntas frequentes"
          title="Ainda com dúvidas?"
          titleClassName="text-[clamp(1.6rem,2.6vw,2.1rem)]"
        />
        <Reveal>
          <FaqList />
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section
      className="py-[110px]"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 0%, var(--accent-soft), transparent 65%), var(--surface)',
      }}
    >
      <div className="max-w-site mx-auto px-6">
        <Reveal className="bg-surface-raised border-line mx-auto max-w-[820px] rounded-[28px] border px-6 py-10 text-center sm:px-11 sm:py-14">
          <Badge>Garantia de {PRODUCT.guaranteeDays} dias</Badge>
          <h2 className="mt-5 mb-3 text-[clamp(1.7rem,3vw,2.3rem)]">
            Comece agora com confiança
          </h2>
          <p className="text-muted mx-auto mb-[30px] max-w-[56ch] text-[clamp(1rem,1.4vw,1.12rem)]">
            Este guia foi criado para que você curta cada momento com seu bebê —
            sem ansiedade, sem medo, com todo o amor do mundo.
          </p>

          <div className="mb-1.5 flex items-baseline justify-center gap-2">
            <span className="text-muted text-[0.95rem]">a partir de</span>
            <span className="font-heading text-accent text-[2.8rem] font-extrabold">
              {formatBRL(PRODUCT.priceInCents)}
            </span>
          </div>
          <p className="text-faint mb-8 text-[0.84rem]">
            Menos do que uma consulta. Conhecimento que você carrega pelos
            próximos anos.
          </p>

          <Button href="/checkout" className="mx-auto w-full max-w-[360px]">
            Ir para o pagamento
          </Button>

          <GuaranteeRow />

          <p className="text-faint border-line mt-8 border-t pt-5 text-[0.76rem] leading-[1.6]">
            ⚠️ {LEGAL_NOTE}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
