import { describe, expect, it } from 'vitest';

import {
  CHAPTERS,
  FAQ_ITEMS,
  FEATURES,
  GUARANTEES,
  PAIN_POINTS,
  TOC_ENTRIES,
} from './content';
import { PRODUCT } from './product';

/*
 * A copy é compartilhada entre landing e produto de propósito. Estes testes
 * travam as invariantes que a duplicação anterior deixava quebrar em silêncio.
 */

describe('estrutura do conteúdo', () => {
  it('tem a mesma quantidade de capítulos anunciada no produto', () => {
    // A página exibe "Os 5 capítulos"; se a lista mudar, o número muda junto.
    expect(CHAPTERS).toHaveLength(PRODUCT.chapters);
    expect(TOC_ENTRIES).toHaveLength(PRODUCT.chapters);
  });

  it('usa a mesma numeração no sumário e nos capítulos', () => {
    expect(CHAPTERS.map((c) => c.num)).toEqual(TOC_ENTRIES.map((t) => t.num));
  });

  it('não tem seção vazia', () => {
    expect(PAIN_POINTS.length).toBeGreaterThan(0);
    expect(FEATURES.length).toBeGreaterThan(0);
    expect(FAQ_ITEMS.length).toBeGreaterThan(0);
    expect(GUARANTEES.length).toBeGreaterThan(0);
  });
});

describe('integridade dos textos', () => {
  it('não repete pergunta no FAQ', () => {
    const perguntas = FAQ_ITEMS.map((f) => f.question);
    expect(new Set(perguntas).size).toBe(perguntas.length);
  });

  it('não tem título ou corpo em branco', () => {
    const textos = [
      ...PAIN_POINTS.flatMap((p) => [p.title, p.body]),
      ...FEATURES.flatMap((f) => [f.title, f.body]),
      ...CHAPTERS.flatMap((c) => [c.title, c.body, c.tag]),
      ...FAQ_ITEMS.flatMap((f) => [f.question, f.answer]),
    ];
    for (const texto of textos) {
      expect(texto.trim().length).toBeGreaterThan(0);
    }
  });

  it('não deixa preço fixo escrito na copy', () => {
    // Preço só pode vir de PRODUCT — foi assim que o protótipo divergiu.
    const todaCopy = [
      ...PAIN_POINTS.map((p) => p.body),
      ...FEATURES.map((f) => f.body),
      ...CHAPTERS.map((c) => c.body),
      ...FAQ_ITEMS.map((f) => f.answer),
      ...GUARANTEES.map((g) => g.label),
    ].join(' ');
    expect(todaCopy).not.toMatch(/R\$/);
  });
});
