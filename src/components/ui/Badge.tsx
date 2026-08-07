import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export type BadgeTone = 'accent' | 'accent-alt' | 'invert';

const tones: Record<BadgeTone, string> = {
  accent: 'bg-accent-soft text-accent border-accent-line',
  /* Ameixa na landing, azul no tema escuro — o token alterna sozinho. */
  'accent-alt': 'bg-accent-alt-soft text-accent-alt border-accent-alt-line',
  invert: 'bg-white/12 text-invert border-white/25',
};

type BadgeProps = {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
};

/** O "eyebrow" do protótipo: pill em caixa alta acima dos títulos de seção. */
export function Badge({ tone = 'accent', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'rounded-pill inline-flex items-center gap-2 border px-3.5 py-1.5',
        'text-[0.78rem] font-semibold tracking-[0.14em] uppercase',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
