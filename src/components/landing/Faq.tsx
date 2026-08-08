import { Reveal, SectionHead } from '@/components/ui';
import { FaqList } from '@/components/ui/FaqList';

export function Faq() {
  return (
    <section className="bg-surface-2 py-[100px]">
      <div className="max-w-site mx-auto px-6">
        <SectionHead
          eyebrow="Perguntas frequentes"
          title="Ainda com dúvidas?"
        />
        <Reveal>
          <FaqList />
        </Reveal>
      </div>
    </section>
  );
}
