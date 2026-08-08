import { Badge, Button, Reveal } from '@/components/ui';
import { PRODUCT } from '@/lib/product';

const META = [
  { num: String(PRODUCT.chapters), label: 'Capítulos' },
  { num: 'PDF', label: 'Formato digital' },
  { num: `${PRODUCT.guaranteeDays} dias`, label: 'Garantia' },
  { num: '100%', label: 'Acesso imediato' },
] as const;

export function ProdutoHero() {
  return (
    <section
      className="border-line border-b py-20 pb-[70px]"
      style={{
        background:
          'radial-gradient(ellipse 90% 70% at 75% -10%, var(--accent-soft), transparent 60%), var(--surface)',
      }}
    >
      <div className="max-w-site mx-auto grid items-center gap-14 px-6 md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Badge>Sobre o guia</Badge>
          <h1 className="mt-5 mb-4 text-[clamp(2rem,3.6vw,2.85rem)]">
            Tudo o que está dentro do Pais de Primeira Viagem
          </h1>
          <p className="text-muted mb-7 max-w-[56ch] text-[clamp(1rem,1.4vw,1.12rem)]">
            Um guia digital direto ao ponto, organizado em {PRODUCT.chapters}{' '}
            capítulos, pra você consultar rápido no meio da noite e voltar a
            dormir com a cabeça mais tranquila.
          </p>

          <div className="mb-[30px] flex flex-wrap gap-3.5">
            <Button href="/checkout">Garantir meu acesso agora</Button>
            <Button href="#capitulos" variant="ghost">
              Ver os capítulos
            </Button>
          </div>

          <div className="flex flex-wrap gap-7">
            {META.map((item) => (
              <div key={item.label} className="flex flex-col gap-0.5">
                <span className="font-heading text-accent text-[1.3rem] font-extrabold">
                  {item.num}
                </span>
                <span className="text-faint text-[0.78rem] tracking-[0.06em] uppercase">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Capa do e-book. Placeholder tipográfico do protótipo — troca por
            imagem real quando o cliente entregar a arte. */}
        <Reveal
          className="border-line relative mx-auto flex aspect-[4/5] w-full max-w-[340px] flex-col justify-between overflow-hidden rounded-[22px] border p-9 md:aspect-[3/4] md:max-w-none"
          style={{
            background:
              'linear-gradient(160deg, var(--surface-raised), var(--surface-raised-2))',
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-20 size-[260px] rounded-full blur-[4px]"
            style={{
              background:
                'radial-gradient(circle, var(--accent-soft), transparent 70%)',
            }}
          />
          <div className="relative">
            <div className="text-accent text-[0.72rem] font-bold tracking-[0.12em] uppercase">
              E-book · Guia digital
            </div>
            <div className="font-heading mt-3.5 text-[1.55rem] leading-[1.2] font-extrabold">
              {PRODUCT.name}
              <br />
              {PRODUCT.subtitle}
            </div>
          </div>
          <div className="text-muted relative flex items-end justify-between text-[0.8rem]">
            <span>Introdução + {PRODUCT.chapters - 1} capítulos</span>
            <span className="border-accent text-accent flex size-[34px] items-center justify-center rounded-full border-[1.5px] text-[0.85rem] font-bold">
              PDF
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
