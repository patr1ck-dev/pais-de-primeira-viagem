import { cn } from '@/lib/cn';

const STEPS = [
  { label: 'Guia', state: 'done' },
  { label: 'Detalhes', state: 'done' },
  { label: 'Pagamento', state: 'current' },
] as const;

export function CheckoutSteps() {
  return (
    <ol className="text-faint mb-11 flex flex-wrap items-center gap-2.5 text-[0.82rem]">
      {STEPS.map((step, index) => (
        <li key={step.label} className="flex items-center gap-2.5">
          {index > 0 && (
            <span aria-hidden="true" className="bg-line h-px w-6" />
          )}
          <span
            className={cn(
              'flex items-center gap-2',
              step.state === 'current' && 'text-content'
            )}
            aria-current={step.state === 'current' ? 'step' : undefined}
          >
            <span
              aria-hidden="true"
              className={cn(
                'flex size-5 items-center justify-center rounded-full border text-[0.7rem] font-bold',
                step.state === 'done'
                  ? 'bg-accent border-accent text-on-accent'
                  : 'bg-surface-raised border-accent text-accent'
              )}
            >
              {step.state === 'done' ? '✓' : index + 1}
            </span>
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  );
}
