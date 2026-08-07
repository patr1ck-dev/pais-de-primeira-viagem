import type { ElementType, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

export type CardTone = 'raised' | 'flat' | 'invert';

const tones: Record<CardTone, string> = {
  /* Cartão padrão: branco na landing, grafite no tema escuro. */
  raised: 'bg-surface-raised border-line text-content',
  /* Sobre fundo já claro/escuro — usado nos itens de sumário. */
  flat: 'bg-surface-2 border-line text-content',
  /* Bloco noturno dentro da landing clara (depoimento, hero cards). */
  invert: 'bg-surface-invert border-line-invert text-invert',
};

type CardProps = {
  tone?: CardTone;
  className?: string;
  children: ReactNode;
  as?: ElementType;
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'className'>;

export function Card({
  tone = 'raised',
  className,
  children,
  as: Tag = 'div',
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn('rounded-card border p-7', tones[tone], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
