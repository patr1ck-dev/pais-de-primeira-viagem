import { Badge, Reveal } from '@/components/ui';
import { QUOTE, TRUST_BULLETS } from '@/lib/content';

export function Trust() {
  return (
    <section className="bg-surface py-[100px]">
      <div className="max-w-site mx-auto grid items-center gap-14 px-6 md:grid-cols-[0.9fr_1.1fr]">
        <Reveal
          className="text-invert relative overflow-hidden rounded-3xl px-9 py-11"
          // Gradiente noturno dentro da seção clara — o cartão de depoimento.
          style={{
            background:
              'linear-gradient(160deg, var(--surface-invert), var(--surface-invert-2))',
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-[60px] -right-[60px] size-[220px] rounded-full blur-[10px]"
            style={{
              background:
                'radial-gradient(circle, rgba(232,166,89,0.5), transparent 70%)',
            }}
          />
          <p className="font-heading relative text-[1.25rem] leading-[1.5] text-white italic">
            &ldquo;{QUOTE.text}&rdquo;
          </p>
          <div className="font-body text-invert-muted relative mt-6 text-[0.85rem] not-italic">
            {QUOTE.source}
          </div>
        </Reveal>

        <Reveal>
          <Badge tone="accent-alt">Por que confiar</Badge>
          <h2 className="mt-4 mb-[18px] text-[clamp(1.7rem,3vw,2.2rem)]">
            Feito para quem está exausto, não para quem tem tempo sobrando
          </h2>
          <ul className="flex flex-col gap-4">
            {TRUST_BULLETS.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-3.5 text-[0.98rem]"
              >
                <span
                  aria-hidden="true"
                  className="bg-accent-alt mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-full text-[0.8rem] text-white"
                >
                  ✓
                </span>
                {bullet}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
