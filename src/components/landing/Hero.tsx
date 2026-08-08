import { Badge, Button, CribIllustration } from '@/components/ui';
import { HERO_STAT } from '@/lib/content';

export function Hero() {
  return (
    <section
      className="text-invert overflow-hidden py-[88px] pb-[100px]"
      style={{
        background:
          'radial-gradient(ellipse 120% 90% at 80% -10%, var(--surface-invert-3), var(--surface-invert) 55%, var(--surface-invert-2) 100%)',
      }}
    >
      <div className="max-w-site mx-auto grid items-center gap-14 px-6 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Badge>Guia digital · PDF de acesso imediato</Badge>
          <h1 className="mt-[22px] mb-5 text-[clamp(2.1rem,4vw,3.1rem)] text-white">
            Seu bebê chegou (ou está chegando). E agora?
          </h1>
          <p className="text-invert-muted mb-[26px] max-w-[52ch] text-[clamp(1.05rem,1.5vw,1.2rem)]">
            Noites sem dormir. Medo de errar. Insegurança a cada choro. Você não
            está sozinho — e não precisa aprender tudo do zero, na base da
            tentativa e erro, às três da manhã.
          </p>

          <div
            className="border-accent mb-[30px] max-w-[46ch] rounded-r-[14px] border-l-[3px] px-5 py-4"
            style={{
              background:
                'color-mix(in srgb, var(--text-invert) 6%, transparent)',
            }}
          >
            <strong className="font-heading text-accent mb-1 block text-[1.05rem]">
              {HERO_STAT.headline}
            </strong>
            <span className="text-invert-muted text-[0.92rem]">
              {HERO_STAT.body}
            </span>
          </div>

          <div className="flex flex-wrap gap-3.5">
            <Button href="/produto">Quero me sentir preparado</Button>
            <Button href="#conteudo" variant="ghost-invert">
              Ver o que tem no guia
            </Button>
          </div>
        </div>

        <div className="relative mx-auto flex aspect-square w-full max-w-[320px] items-center justify-center md:max-w-none">
          {/* O "respiro" da luz da lamparina; motion-safe cobre reduced-motion. */}
          <div
            className="motion-safe:animate-breathe absolute size-[78%] rounded-full blur-[6px]"
            style={{
              background:
                'radial-gradient(circle, rgba(232,166,89,0.55), rgba(232,166,89,0.12) 55%, transparent 72%)',
            }}
          />
          <CribIllustration className="relative z-[2] w-[78%]" />
        </div>
      </div>
    </section>
  );
}
