/**
 * Copy do funil, extraída do protótipo estático.
 *
 * FAQ e features aparecem tanto na landing quanto na página de produto com
 * texto idêntico. Centralizar aqui evita que as duas versões divirjam quando o
 * cliente pedir um ajuste de texto — que foi exatamente o que aconteceu com o
 * preço no protótipo.
 */

import type { IconName } from '@/components/ui/icons';

export type PainPoint = {
  icon: IconName;
  title: string;
  body: string;
};

export const PAIN_POINTS: readonly PainPoint[] = [
  {
    icon: 'moon',
    title: 'Falta de sono',
    body: 'Bebê chora à noite e você não sabe o motivo — e o cansaço acumula a cada hora que passa.',
  },
  {
    icon: 'question',
    title: 'Medo de errar',
    body: '"E se eu fizer algo errado?" é a pergunta que não sai da cabeça de nenhum pai iniciante.',
  },
  {
    icon: 'waves',
    title: 'Informação contraditória',
    body: 'A internet confunde mais do que ajuda — cada site, cada grupo de WhatsApp diz uma coisa diferente.',
  },
  {
    icon: 'clock',
    title: 'Isolamento',
    body: 'Avós dão conselhos antigos. Amigos sem filhos não entendem. Às vezes, você se sente sozinho.',
  },
] as const;

export type Feature = {
  icon: IconName;
  title: string;
  body: string;
};

export const FEATURES: readonly Feature[] = [
  {
    icon: 'user',
    title: 'Especialistas',
    body: 'Escrito com base em orientação pediátrica e experiência real de maternidade/paternidade.',
  },
  {
    icon: 'shieldCheck',
    title: 'Baseado em ciência',
    body: 'Protocolos modernos e seguros — sem achismo, sem mitos passados de geração em geração.',
  },
  {
    icon: 'book',
    title: 'Linguagem simples',
    body: 'Direta, sem enrolação. Você entende na primeira leitura — mesmo exausto, às 3 da manhã.',
  },
  {
    icon: 'bolt',
    title: 'Pronto para usar',
    body: 'Passo a passo que funciona desde o primeiro dia em casa — sem precisar decorar nada antes.',
  },
] as const;

export type TocEntry = {
  num: string;
  title: string;
  body: string;
};

/** Versão curta, usada na landing. */
export const TOC_ENTRIES: readonly TocEntry[] = [
  {
    num: '01',
    title: 'Introdução',
    body: 'Validando seus medos e trazendo segurança para o começo da jornada.',
  },
  {
    num: '02',
    title: 'Banho, pomadas e pele',
    body: 'Passo a passo completo para o primeiro banho e cuidados diários com a pele.',
  },
  {
    num: '03',
    title: 'Tudo sobre fraldas',
    body: 'Tipos, tamanhos, marcas e como evitar assaduras desde o início.',
  },
  {
    num: '04',
    title: 'Como vestir o bebê',
    body: 'Dicas práticas para meninos e meninas, em qualquer estação do ano.',
  },
  {
    num: '05',
    title: 'Primeiros socorros',
    body: 'Engasgo, febre e cólicas — o que fazer com calma e rapidez.',
  },
] as const;

export type Chapter = TocEntry & { tag: string };

/** Versão longa com tag, usada na página de produto. */
export const CHAPTERS: readonly Chapter[] = [
  {
    num: '01',
    title: 'Introdução — Você não está sozinho',
    body: 'Validando seus medos e trazendo segurança para o começo da jornada: por que sentir medo é normal e por que você não precisa ser perfeito.',
    tag: 'Acolhimento',
  },
  {
    num: '02',
    title: 'Banho, pomadas e pele',
    body: 'Passo a passo completo para o primeiro banho, produtos certos, temperatura ideal e como segurar o bebê com segurança — incluindo pele sensível.',
    tag: 'Cuidados diários',
  },
  {
    num: '03',
    title: 'Tudo sobre fraldas',
    body: 'Tipos, tamanhos, marcas, como evitar vazamentos e assaduras desde o início — sem indicar produto caro à toa.',
    tag: 'Rotina',
  },
  {
    num: '04',
    title: 'Como vestir o bebê',
    body: 'Dicas práticas para frio e calor, com cuidados específicos para meninos e meninas, em qualquer estação do ano.',
    tag: 'Dia a dia',
  },
  {
    num: '05',
    title: 'Primeiros socorros',
    body: 'Engasgo, febre, cólicas — o que fazer agora, com calma e segurança, sem entrar em pânico.',
    tag: 'Emergência',
  },
] as const;

export type FaqItem = { question: string; answer: string };

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: 'Preciso de muitos produtos caros?',
    answer:
      'Não. O guia lista exatamente o essencial para os primeiros meses — sem desperdício e sem indicar nada supérfluo.',
  },
  {
    question: 'Funciona para meninos e meninas?',
    answer:
      'Sim. Há dicas específicas para cada um ao longo de todo o conteúdo, principalmente nos capítulos de higiene e roupas.',
  },
  {
    question: 'E se meu bebê tiver pele sensível?',
    answer:
      'Há um capítulo inteiro dedicado a cuidados com pele delicada, do banho às pomadas.',
  },
  {
    question: 'Como recebo o guia depois da compra?',
    answer:
      'Acesso imediato após a confirmação do pagamento, direto no seu e-mail — disponível em qualquer dispositivo, a qualquer hora.',
  },
] as const;

export const TRUST_BULLETS: readonly string[] = [
  'Conteúdo revisado e organizado por capítulo, sem enrolação',
  'Cuidados específicos para meninos e meninas ao longo do guia',
  'Capítulo dedicado a bebês com pele sensível',
  'Lista do essencial — sem indicar produtos caros ou desnecessários',
] as const;

export type Guarantee = { icon: IconName; label: string };

export const GUARANTEES: readonly Guarantee[] = [
  { icon: 'lock', label: '7 dias de garantia' },
  { icon: 'shield', label: 'Pagamento seguro' },
  { icon: 'phone', label: 'Acesso imediato' },
] as const;

export const QUOTE = {
  text: 'Você não precisa ser perfeito. Bebês são resilientes — o amor e a atenção fazem toda a diferença.',
  source: '— Trecho da Introdução do guia',
} as const;

export const LEGAL_NOTE =
  'Aviso legal: este material é de caráter educativo e informativo. Não substitui consulta médica ou acompanhamento profissional de saúde. Sempre consulte o pediatra do seu bebê para orientações específicas.';

export const LEGAL_NOTE_SHORT =
  'Este material é de caráter educativo e informativo. Não substitui consulta médica ou acompanhamento profissional de saúde.';

export const HERO_STAT = {
  headline:
    '87% dos pais de primeira viagem sentem pânico nas primeiras semanas.',
  body: 'Mil dúvidas passam pela cabeça: como banhar? qual fralda usar? isso é febre? Este guia foi feito exatamente para esse momento.',
} as const;
