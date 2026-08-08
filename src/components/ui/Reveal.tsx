'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ElementType, ReactNode } from 'react';

import { cn } from '@/lib/cn';

type RevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
};

/**
 * Scroll-reveal do protótipo, um observer por elemento.
 *
 * O estado escondido vem do CSS e já chega no HTML do servidor, então não há
 * flash de conteúdo antes da hidratação. Um <noscript> no layout anula esse
 * estado para quem tem JS desligado — o protótipo original deixava a página
 * inteira invisível nesse caso.
 *
 * `prefers-reduced-motion` é tratado no CSS, então aqui não há checagem de
 * media query — o observer roda, mas a transição não existe.
 *
 * Não há fallback para ausência de IntersectionObserver: a API é baseline
 * desde 2019 e o ramo seria código morto que ainda por cima obrigaria um
 * setState dentro do efeito.
 */
export function Reveal({
  children,
  className,
  style,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Tag
      ref={ref}
      style={style}
      className={cn('reveal', visible && 'is-visible', className)}
    >
      {children}
    </Tag>
  );
}
