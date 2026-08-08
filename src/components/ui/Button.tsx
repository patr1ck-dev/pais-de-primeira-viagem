import Link from 'next/link';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'ghost' | 'ghost-invert';
export type ButtonSize = 'sm' | 'md';

const base =
  'inline-flex items-center justify-center gap-2.5 rounded-pill font-semibold ' +
  'border-0 cursor-pointer font-body transition-[transform,box-shadow,background-color,border-color] ' +
  'duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60 ' +
  // O hover-lift some sob prefers-reduced-motion, exigência do protótipo.
  'motion-safe:hover:not-disabled:-translate-y-0.5';

const sizes: Record<ButtonSize, string> = {
  sm: 'px-5 py-2.5 text-[0.86rem]',
  md: 'px-7 py-4 text-base',
};

const variants: Record<ButtonVariant, string> = {
  // bg-accent/on-accent trocam com a paleta: âmbar na landing, esmeralda no checkout.
  primary:
    'bg-accent text-on-accent shadow-(--shadow-accent) hover:shadow-(--shadow-accent-hover)',
  ghost:
    'bg-transparent text-muted border-[1.5px] border-line hover:border-faint hover:text-content',
  'ghost-invert':
    'bg-transparent text-invert border-[1.5px] border-line-invert hover:border-invert',
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * CTA compartilhado pelas duas paletas.
 *
 * Com `href` vira <Link> (mantém o prefetch do Next); sem `href`, <button>.
 * O protótipo usa <a> estilizado de botão em quase todo CTA — sem esse ramo,
 * cada CTA precisaria duplicar as classes.
 */
function classesFor({ variant, size, fullWidth, className }: CommonProps) {
  return cn(
    base,
    sizes[size ?? 'md'],
    variants[variant ?? 'primary'],
    fullWidth && 'w-full',
    className
  );
}

export function Button(props: ButtonProps) {
  // Estreitar a união ANTES de desestruturar: `href?: undefined` no ramo
  // <button> discrimina os dois membros, então cada bloco já vê o tipo certo
  // e nenhum cast é necessário.
  if (props.href !== undefined) {
    const { href, variant, size, fullWidth, className, children, ...anchor } =
      props;
    return (
      <Link
        href={href}
        className={classesFor({
          variant,
          size,
          fullWidth,
          className,
          children,
        })}
        {...anchor}
      >
        {children}
      </Link>
    );
  }

  const {
    href: _href,
    variant,
    size,
    fullWidth,
    className,
    children,
    type = 'button',
    ...button
  } = props;
  return (
    <button
      type={type}
      className={classesFor({ variant, size, fullWidth, className, children })}
      {...button}
    >
      {children}
    </button>
  );
}
