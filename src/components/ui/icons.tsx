import type { SVGProps } from 'react';

/**
 * Os ícones do protótipo, um a um.
 *
 * Todos herdam `currentColor`, então a cor vem do token da paleta ativa —
 * âmbar na landing, esmeralda no checkout, sem prop de cor.
 */

type IconProps = SVGProps<SVGSVGElement> & { strokeWidth?: number };

function Svg({ children, strokeWidth = 1.6, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

const Moon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </Svg>
);

const Question = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path
      d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="17.3" r="0.6" fill="currentColor" stroke="none" />
  </Svg>
);

const Waves = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 12c3-6 6-6 9 0s6 6 9 0" strokeLinecap="round" />
  </Svg>
);

const Clock = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const User = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" strokeLinecap="round" />
  </Svg>
);

const ShieldCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const Book = (p: IconProps) => (
  <Svg {...p}>
    <path
      d="M4 19.5V5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5a2.5 2.5 0 0 0 0 5H20"
      strokeLinejoin="round"
    />
  </Svg>
);

const Bolt = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinejoin="round" />
  </Svg>
);

const Lock = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </Svg>
);

const Shield = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 2 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-4Z" />
  </Svg>
);

const Phone = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <path d="M9 18h6" strokeLinecap="round" />
  </Svg>
);

export const ICONS = {
  moon: Moon,
  question: Question,
  waves: Waves,
  clock: Clock,
  user: User,
  shieldCheck: ShieldCheck,
  book: Book,
  bolt: Bolt,
  lock: Lock,
  shield: Shield,
  phone: Phone,
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  ...props
}: IconProps & { name: IconName }): React.ReactElement {
  const Component = ICONS[name];
  return <Component {...props} />;
}

/** Berço do hero da landing. Decorativo — fica fora da árvore de acessibilidade. */
export function CribIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <ellipse cx="160" cy="290" rx="120" ry="10" fill="#000" opacity="0.15" />
      <path
        d="M60 120 V260 M260 120 V260"
        stroke="#F5EDE0"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M60 150 H260 M60 190 H260 M60 230 H260"
        stroke="#F5EDE0"
        strokeWidth="4"
        opacity="0.28"
      />
      <rect
        x="55"
        y="255"
        width="210"
        height="14"
        rx="7"
        fill="#F5EDE0"
        opacity="0.45"
      />
      <rect x="80" y="215" width="160" height="46" rx="20" fill="#FBF3E7" />
      <circle cx="160" cy="205" r="26" fill="#EAC9A6" />
      <path
        d="M140 205 q20 22 40 0"
        stroke="#2A211B"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
