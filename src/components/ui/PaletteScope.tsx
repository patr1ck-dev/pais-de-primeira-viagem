import type { ElementType, ReactNode } from 'react';

import { cn } from '@/lib/cn';

export type Palette = 'warm' | 'dark';

type PaletteScopeProps = {
  palette: Palette;
  children: ReactNode;
  className?: string;
  /** Elemento raiz. Padrão `div`; use `body`-level só no layout. */
  as?: ElementType;
};

/**
 * Define qual paleta vale para a subárvore.
 *
 * Landing = "warm", produto/checkout/obrigado = "dark". Os componentes ui/ não
 * sabem qual tema estão usando — leem só os tokens semânticos que este wrapper
 * resolve.
 */
export function PaletteScope({
  palette,
  children,
  className,
  as: Tag = 'div',
}: PaletteScopeProps) {
  return (
    <Tag
      data-palette={palette}
      className={cn('bg-surface text-content font-body', className)}
    >
      {children}
    </Tag>
  );
}
