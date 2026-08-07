import { PaletteScope } from '@/components/ui';

// Esqueleto da Fase 2. As seções (Hero, PainPoints, SolutionFeatures, Toc,
// Trust, Faq, Pricing) entram na Fase 3.
export default function LandingPage() {
  return (
    <PaletteScope palette="warm" className="min-h-screen">
      <main className="max-w-site mx-auto px-6 py-24">
        <h1 className="text-4xl">Pais de Primeira Viagem</h1>
        <p className="text-muted mt-4">Landing — conteúdo chega na Fase 3.</p>
      </main>
    </PaletteScope>
  );
}
