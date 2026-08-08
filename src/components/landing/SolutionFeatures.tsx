import { Badge, Card, Icon, Reveal, SectionHead } from '@/components/ui';
import { FEATURES } from '@/lib/content';

/** A transição noite → amanhecer que liga a seção de dores à de solução. */
export function Dawn() {
  return (
    <section
      className="px-6 pt-[100px] pb-10 text-center text-white"
      style={{
        background:
          'linear-gradient(180deg, var(--surface-invert-2) 0%, var(--surface-invert) 20%, #7A5D4A 48%, var(--surface-2) 78%, var(--surface) 100%)',
      }}
    >
      <Reveal className="max-w-site mx-auto">
        <Badge tone="invert">A virada</Badge>
        <h2 className="mx-auto mt-[22px] mb-4 max-w-[18ch] text-[clamp(1.9rem,3.4vw,2.6rem)] text-white">
          Dá pra atravessar isso com calma
        </h2>
        <p className="mx-auto max-w-[56ch] text-white/85">
          Este guia existe para trocar o pânico por clareza — um passo de cada
          vez, na linguagem que você entende de primeira.
        </p>
      </Reveal>
    </section>
  );
}

export function SolutionFeatures() {
  return (
    <section id="solucao" className="bg-surface pt-5 pb-[100px]">
      <div className="max-w-site mx-auto px-6">
        <SectionHead
          eyebrow="A solução"
          title="Seu guia completo e prático"
          eyebrowTone="accent-alt"
        />

        <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <Reveal key={feature.title}>
              <Card
                className="h-full px-[22px] py-[26px]"
                style={{ boxShadow: '0 12px 30px -18px rgba(42,33,27,0.18)' }}
              >
                <Icon
                  name={feature.icon}
                  className="text-accent-strong mb-4 size-[38px]"
                />
                <h3 className="mb-2 text-[1.02rem]">{feature.title}</h3>
                <p className="text-muted text-[0.9rem]">{feature.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
