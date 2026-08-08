import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { Badge, type BadgeTone } from './Badge';
import { Reveal } from './Reveal';

type SectionHeadProps = {
  eyebrow: string;
  title: ReactNode;
  eyebrowTone?: BadgeTone;
  /** Títulos sobre fundo noturno na landing. */
  invert?: boolean;
  className?: string;
  titleClassName?: string;
};

/** O par eyebrow + h2 que abre quase toda seção do protótipo. */
export function SectionHead({
  eyebrow,
  title,
  eyebrowTone = 'accent',
  invert = false,
  className,
  titleClassName,
}: SectionHeadProps) {
  return (
    <Reveal className={cn('mb-12 max-w-[640px]', className)}>
      <Badge tone={eyebrowTone}>{eyebrow}</Badge>
      <h2
        className={cn(
          'mt-4 text-[clamp(1.7rem,3vw,2.2rem)]',
          invert ? 'text-invert' : 'text-content',
          titleClassName
        )}
      >
        {title}
      </h2>
    </Reveal>
  );
}
