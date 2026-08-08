import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { Icon } from './icons';

/*
 * Cabeçalho e rodapé compartilhados.
 *
 * Não estavam na árvore que você desenhou, mas as três páginas repetem a mesma
 * marca com pequenas variações (a landing mostra o nome + CTA, produto e
 * checkout mostram "voltar"). Sem isso, o brand-dot com glow seria copiado em
 * três lugares.
 */

export function BrandMark({
  className,
  /** Na barra de navegação o nome encosta no CTA em telas pequenas; o
   *  protótipo esconde o texto abaixo de 560px. No rodapé há espaço, então
   *  o nome fica sempre visível. */
  hideNameOnMobile = false,
}: {
  className?: string;
  hideNameOnMobile?: boolean;
}) {
  return (
    <span className={cn('font-heading flex items-center gap-2.5', className)}>
      <span
        className="bg-accent size-2.5 shrink-0 rounded-full"
        style={{ boxShadow: '0 0 14px 3px var(--accent)' }}
      />
      <span className={cn(hideNameOnMobile && 'max-[560px]:hidden')}>
        Pais de Primeira Viagem
      </span>
    </span>
  );
}

type SiteNavProps = {
  /** `brand` = landing; `back` = produto e checkout. */
  left: 'brand' | { backHref: string; backLabel: string };
  right?: ReactNode;
  sticky?: boolean;
  /** A landing tem barra noturna translúcida sobre fundo creme. */
  tone?: 'invert' | 'surface';
};

export function SiteNav({
  left,
  right,
  sticky = true,
  tone = 'surface',
}: SiteNavProps) {
  return (
    <header
      className={cn(
        'z-50 border-b backdrop-blur-[10px]',
        sticky && 'sticky top-0',
        tone === 'invert'
          ? 'border-line-invert text-invert'
          : 'border-line text-content'
      )}
      style={{
        background:
          tone === 'invert'
            ? 'color-mix(in srgb, var(--surface-invert-2) 82%, transparent)'
            : 'color-mix(in srgb, var(--surface) 86%, transparent)',
      }}
    >
      <div className="max-w-site mx-auto flex items-center justify-between px-6 py-4">
        {left === 'brand' ? (
          <Link href="/" className="text-[1.05rem] font-semibold">
            <BrandMark hideNameOnMobile />
          </Link>
        ) : (
          <Link
            href={left.backHref}
            className="text-muted hover:text-content flex items-center gap-1.5 text-[0.85rem] transition-colors"
          >
            &larr; {left.backLabel}
          </Link>
        )}
        {right}
      </div>
    </header>
  );
}

type SiteFooterProps = {
  /** A landing usa o azul-noite; produto e checkout, a superfície 2. */
  tone?: 'invert' | 'surface';
  showCopyright?: boolean;
};

export function SiteFooter({
  tone = 'surface',
  showCopyright = true,
}: SiteFooterProps) {
  return (
    <footer
      className={cn(
        'border-t px-6 py-10 text-center text-[0.84rem]',
        tone === 'invert'
          ? 'bg-surface-invert-2 text-invert-muted border-transparent'
          : 'bg-surface-2 text-faint border-line'
      )}
    >
      <div className="max-w-site mx-auto">
        <BrandMark className="justify-center" />
        {showCopyright && (
          <p className="mt-2.5">
            © 2026 Pais de Primeira Viagem · Guia digital para os primeiros
            meses
          </p>
        )}
      </div>
    </footer>
  );
}

export function SecureBadge() {
  return (
    <span className="text-muted flex items-center gap-2 text-[0.82rem]">
      <Icon name="lock" strokeWidth={2} className="text-accent size-[15px]" />
      Ambiente seguro
    </span>
  );
}
