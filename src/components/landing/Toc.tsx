import { Reveal, SectionHead } from '@/components/ui';
import { TOC_ENTRIES } from '@/lib/content';

export function Toc() {
  return (
    <section id="conteudo" className="bg-surface-2 py-[100px]">
      <div className="max-w-site mx-auto px-6">
        <SectionHead
          eyebrow="O que você vai aprender"
          title="Sumário do guia"
        />

        {/* O gap de 1px sobre fundo --line é o que desenha as divisórias
            da grade, como no protótipo. */}
        <div className="border-line rounded-card bg-line mt-11 grid gap-px overflow-hidden border md:grid-cols-2">
          {TOC_ENTRIES.map((entry) => (
            <Reveal
              key={entry.num}
              className="bg-surface-2 flex gap-5 px-8 py-[30px]"
            >
              <span className="font-heading text-accent-strong min-w-[2.2ch] shrink-0 text-[1.6rem] font-semibold">
                {entry.num}
              </span>
              <div>
                <h3 className="mb-1.5 text-[1.08rem]">{entry.title}</h3>
                <p className="text-muted text-[0.9rem]">{entry.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
