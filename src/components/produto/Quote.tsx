import { Reveal } from '@/components/ui';
import { QUOTE } from '@/lib/content';

export function Quote() {
  return (
    <section className="bg-surface py-[100px]">
      <div className="max-w-site mx-auto px-6">
        <Reveal
          className="border-line relative mx-auto max-w-[760px] rounded-3xl border px-6 py-13 text-center sm:px-11"
          style={{
            background:
              'linear-gradient(160deg, var(--surface-raised), var(--surface-raised-2))',
          }}
        >
          <span
            aria-hidden="true"
            className="font-heading text-accent-strong absolute top-2 left-6 text-[5rem] leading-none"
          >
            &ldquo;
          </span>
          <p className="font-heading relative text-[1.3rem] leading-[1.5] font-semibold">
            {QUOTE.text}
          </p>
          <div className="text-muted mt-5 text-[0.88rem]">{QUOTE.source}</div>
        </Reveal>
      </div>
    </section>
  );
}
