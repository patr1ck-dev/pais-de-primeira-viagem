import { Card, Icon, Reveal, SectionHead } from '@/components/ui';
import { FEATURES } from '@/lib/content';

export function ProdutoFeatures() {
  return (
    <section className="bg-surface py-24">
      <div className="max-w-site mx-auto px-6">
        <SectionHead
          eyebrow="Por que esse guia"
          title="Feito pra ser lido no meio do caos, não num sofá tranquilo"
          titleClassName="text-[clamp(1.6rem,2.6vw,2.1rem)]"
        />

        <div className="mt-11 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <Reveal key={feature.title}>
              <Card className="h-full px-[22px] py-[26px]">
                <Icon
                  name={feature.icon}
                  className="text-accent mb-4 size-[34px]"
                />
                <h3 className="font-heading mb-2 text-base">{feature.title}</h3>
                <p className="text-muted text-[0.88rem]">{feature.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
