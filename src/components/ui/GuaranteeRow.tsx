import { cn } from '@/lib/cn';
import { GUARANTEES } from '@/lib/content';
import { Icon } from './icons';

/** Os três selos de confiança abaixo do CTA. */
export function GuaranteeRow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'my-[30px] flex flex-col items-center justify-center gap-3.5 sm:flex-row',
        className
      )}
    >
      {GUARANTEES.map((item) => (
        <div
          key={item.label}
          className="bg-surface-raised border-line text-muted rounded-pill flex items-center gap-2 border px-[18px] py-2.5 text-[0.86rem] font-semibold"
        >
          <Icon
            name={item.icon}
            strokeWidth={1.8}
            className="text-accent-strong size-4 shrink-0"
          />
          {item.label}
        </div>
      ))}
    </div>
  );
}
