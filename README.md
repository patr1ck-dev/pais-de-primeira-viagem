# Pais de Primeira Viagem

Funil de vendas com checkout próprio para o e-book _Pais de Primeira Viagem —
Guia Completo para os Primeiros Meses_.

Landing → página de produto → checkout (Pix ou cartão) → confirmação →
entrega automática do PDF por e-mail e download no dispositivo.

## Stack

Next.js 16 (App Router) · TypeScript strict · Tailwind 4 · Mercado Pago ·
Resend · Vercel

**Sem banco de dados.** O link de download é um token assinado com HMAC que
carrega e-mail, pagamento e validade — o servidor não precisa lembrar de nada.

## Rodando

```bash
npm install
cp .env.example .env.local   # preencha as chaves
npm run dev
```

As páginas sobem sem nenhuma credencial. Sem `MERCADOPAGO_ACCESS_TOKEN` o
checkout responde 503 e o cartão aparece como indisponível — degrada, não quebra.

## Comandos

|                      |                                            |
| -------------------- | ------------------------------------------ |
| `npm run dev`        | servidor de desenvolvimento                |
| `npm run verify`     | typecheck + lint + format + testes + build |
| `npm test`           | só os testes                               |
| `npm run test:watch` | testes em watch                            |

`verify` é a mesma sequência que o CI roda a cada push.

## Estrutura

```
src/
  app/
    page.tsx                          Landing (paleta clara)
    produto/                          Detalhes do e-book (paleta escura)
    checkout/                         Pagamento
    obrigado/                         Pós-compra: status + download
    download/[token]/route.ts         Valida o token e serve o PDF
    api/
      checkout/route.ts               Cria a cobrança
      webhooks/mercadopago/route.ts   Recebe a confirmação
  components/   landing/ produto/ checkout/ ui/
  lib/          mercadopago, email, download-token, product, content, env
  styles/       tokens.css — as duas paletas
private/        o PDF, fora de public/
docs/           testes-sandbox.md
```

## Decisões que não são óbvias no código

**Duas paletas, um só componente.** `tokens.css` tem duas camadas: as cores
literais do protótipo e tokens semânticos (`--surface`, `--accent`...). Trocar
`data-palette` no wrapper troca a camada inteira, então o mesmo `<Button>` é
âmbar na landing e esmeralda no checkout, sem `if` de tema.

**O preço nunca vem do cliente.** O schema de `/api/checkout` não tem campo de
valor; ele sai de `PRODUCT.priceInCents`. Aceitar valor do corpo da request é
deixar o comprador escolher quanto paga.

**O cartão não passa pelo servidor.** O Brick tokeniza no navegador e o backend
recebe só um token descartável. É o que mantém o projeto fora do escopo
PCI-DSS — os `<input>` de cartão do protótipo original não podiam ir a produção.

**O PDF fica fora de `public/`.** Tudo em `public/` é servido por URL direta; o
guia seria baixável sem pagar e o token viraria decoração. A leitura está
isolada em `lib/pdf-source.ts`, então migrar para Blob/S3 é mexer num arquivo só.

**O webhook não confia no que recebe.** Valida a assinatura antes de tudo e
reconsulta o status na API — o corpo diz apenas _qual_ pagamento mudou, nunca se
foi aprovado.

## Variáveis de ambiente

Ver `.env.example`. Nenhuma é lida no import: cada rota pede a sua e falha só
ali, o que permite as páginas buildarem sem credencial nenhuma.

## Testes

```bash
npm test
```

Cobrem o token HMAC (adulteração, expiração, segredo trocado), o contrato do
checkout (valor e dado de cartão não entram pelo corpo), formatação de preço e
as invariantes da copy compartilhada.

O fluxo real com o Mercado Pago é validado à mão: ver [docs/testes-sandbox.md](docs/testes-sandbox.md).
