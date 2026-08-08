import { Reveal, SectionHead } from '@/components/ui';
import { CHAPTERS } from '@/lib/content';
import { PRODUCT } from '@/lib/product';

export function Chapters() {
  return (
    <section id="capitulos" className="bg-surface-2 py-24">
      <div className="max-w-site mx-auto px-6">
        <SectionHead
          eyebrow="Sumário completo"
          title={`Os ${PRODUCT.chapters} capítulos do guia`}
          titleClassName="text-[clamp(1.6rem,2.6vw,2.1rem)]"
        />

        <div className="border-line rounded-card bg-line flex flex-col gap-px overflow-hidden border">
          {CHAPTERS.map((chapter) => (
            <Reveal
              key={chapter.num}
              className="bg-surface-raised hover:bg-surface-raised-2 grid grid-cols-[44px_1fr] items-start gap-5 px-7 py-[26px] transition-colors md:grid-cols-[60px_1fr]"
            >
              <span className="font-heading text-accent-strong text-[1.4rem] font-extrabold">
                {chapter.num}
              </span>
              <div>
                <h3 className="mb-1.5 text-[1.05rem]">{chapter.title}</h3>
                <p className="text-muted max-w-[60ch] text-[0.92rem]">
                  {chapter.body}
                </p>
                <span className="bg-accent-soft text-accent rounded-pill mt-2.5 inline-block px-2.5 py-[3px] text-[0.72rem]">
                  {chapter.tag}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
