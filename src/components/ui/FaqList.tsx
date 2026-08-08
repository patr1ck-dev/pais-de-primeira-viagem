import { cn } from '@/lib/cn';
import { FAQ_ITEMS } from '@/lib/content';

/**
 * Acordeão de perguntas frequentes.
 *
 * Landing e produto usam o mesmo texto e a mesma mecânica, mudando só a
 * paleta — que os tokens resolvem sozinhos. `<details>` nativo mantém o
 * comportamento sem JS e a semântica de acessibilidade de graça.
 */
export function FaqList({ className }: { className?: string }) {
  return (
    <div className={cn('mt-10 max-w-[760px]', className)}>
      {FAQ_ITEMS.map((item) => (
        <details
          key={item.question}
          className="group border-line bg-surface open:border-accent-line mb-3 rounded-[14px] border px-[22px] py-1.5 transition-colors"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-semibold [&::-webkit-details-marker]:hidden">
            {item.question}
            <span className="font-heading text-accent-strong shrink-0 text-[1.4rem] transition-transform duration-[250ms] group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="text-muted max-w-[60ch] pb-[18px] text-[0.95rem]">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
