import { Icon, Reveal, SectionHead } from '@/components/ui';
import { PAIN_POINTS } from '@/lib/content';

export function PainPoints() {
  return (
    <section className="bg-surface-invert-2 text-invert py-[90px]">
      <div className="max-w-site mx-auto px-6">
        <SectionHead
          eyebrow="O que ninguém te avisou"
          title="As dores reais de quem está começando"
          invert
          titleClassName="text-white text-[clamp(1.8rem,3vw,2.3rem)]"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PAIN_POINTS.map((pain) => (
            <Reveal
              key={pain.title}
              className="bg-surface-invert-3 border-line-invert rounded-card border px-6 py-7"
            >
              <Icon
                name={pain.icon}
                className="text-accent mb-[18px] size-[42px]"
              />
              <h3 className="mb-2 text-[1.05rem] font-semibold text-white">
                {pain.title}
              </h3>
              <p className="text-invert-muted text-[0.92rem]">{pain.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
