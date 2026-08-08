import type { Metadata } from 'next';

import {
  Chapters,
  FinalCta,
  ProdutoFaq,
  ProdutoFeatures,
  ProdutoHero,
  Quote,
  Stats,
} from '@/components/produto';
import { Button, PaletteScope, SiteFooter, SiteNav } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Pais de Primeira Viagem — O que tem dentro do guia',
  description:
    'Conheça todos os capítulos do guia Pais de Primeira Viagem: banho, fraldas, roupas e primeiros socorros, explicados com calma. Garantia de 7 dias.',
};

export default function ProdutoPage() {
  return (
    <PaletteScope palette="dark">
      <SiteNav
        left={{ backHref: '/', backLabel: 'Voltar' }}
        right={
          <Button href="/checkout" size="sm">
            Comprar agora
          </Button>
        }
      />

      <main>
        <ProdutoHero />
        <Chapters />
        <ProdutoFeatures />
        <Stats />
        <Quote />
        <ProdutoFaq />
        <FinalCta />
      </main>

      <SiteFooter />
    </PaletteScope>
  );
}
