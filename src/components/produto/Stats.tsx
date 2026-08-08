import { Reveal } from '@/components/ui';
import { formatBRL, PRODUCT } from '@/lib/product';

/*
 * O protótipo trazia "R$29–49" aqui, faixa que não bate com o preço único de
 * R$ 29,90 exibido nas outras duas páginas. Passei a ler de PRODUCT para o
 * número não voltar a divergir.
 */
const STATS = [
  {
    num: '87%',
    label: 'dos pais de primeira viagem sentem pânico nas primeiras semanas',
  },
  {
    num: `${PRODUCT.guaranteeDays} dias`,
    label: 'de garantia incondicional — 100% do valor de volta',
  },
  {
    num: formatBRL(PRODUCT.priceInCents),
    label: 'menos que uma consulta, conhecimento que dura anos',
  },
] as const;

export function Stats() {
  return (
    <section className="bg-surface-2 border-line border-y py-[70px]">
      <div className="max-w-site mx-auto grid gap-8 px-6 text-center md:grid-cols-3 md:gap-6">
        {STATS.map((stat) => (
          <Reveal key={stat.label}>
            <div className="font-heading text-accent text-[clamp(2rem,4vw,2.6rem)] font-extrabold">
              {stat.num}
            </div>
            <div className="text-muted mt-1.5 text-[0.9rem]">{stat.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
