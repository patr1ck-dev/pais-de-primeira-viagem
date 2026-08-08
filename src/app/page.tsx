import {
  Dawn,
  Faq,
  Hero,
  PainPoints,
  Pricing,
  SolutionFeatures,
  Toc,
  Trust,
} from '@/components/landing';
import { Button, PaletteScope, SiteFooter, SiteNav } from '@/components/ui';

export default function LandingPage() {
  return (
    <PaletteScope palette="warm">
      <SiteNav
        left="brand"
        tone="invert"
        right={
          <Button href="/produto" size="sm">
            Quero o guia
          </Button>
        }
      />

      <main id="top">
        <Hero />
        <PainPoints />
        <Dawn />
        <SolutionFeatures />
        <Toc />
        <Trust />
        <Faq />
        <Pricing />
      </main>

      <SiteFooter tone="invert" />
    </PaletteScope>
  );
}
