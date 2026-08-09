# Fase 6 — Testes em sandbox

Guia para validar o funil ponta a ponta com as credenciais de teste do Mercado
Pago, antes de qualquer centavo real passar pelo sistema.

---

## 1. Credenciais

No painel: **[Suas integrações](https://www.mercadopago.com.br/developers/panel/app)
→ sua aplicação → Credenciais de teste**.

Copie os dois valores. Eles começam com `TEST-`. **Se o seu token não começa com
`TEST-`, você está prestes a cobrar de verdade** — pare e troque.

Na mesma aplicação, vá em **Webhooks → Configurar notificações** e copie o
**segredo de assinatura**. É ele que impede alguém de forjar uma confirmação de
pagamento (`POST` direto no seu endpoint liberando o PDF de graça).

### `.env.local`

```bash
MERCADOPAGO_ACCESS_TOKEN=TEST-0000000000000000-000000-...
MERCADOPAGO_PUBLIC_KEY=TEST-00000000-0000-0000-0000-000000000000
MERCADOPAGO_WEBHOOK_SECRET=<segredo de assinatura do painel>

RESEND_API_KEY=re_...
EMAIL_FROM="Pais de Primeira Viagem <guia@seudominio.com.br>"

DOWNLOAD_TOKEN_SECRET=<gere abaixo>
NEXT_PUBLIC_SITE_URL=<sua URL pública, ver seção 2>
```

Gere um segredo novo para o token de download:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> O `DOWNLOAD_TOKEN_SECRET` que está hoje no `.env.local` foi gerado durante o
> desenvolvimento e passou pelo terminal. Use um novo em produção. Trocá-lo
> invalida todos os links já enviados — o que é justamente o botão de pânico se
> algum vazar.

---

## 2. O webhook precisa de URL pública

`localhost` não recebe notificação do Mercado Pago. Duas opções:

**A) Túnel (mais rápido para iterar)**

```bash
npx cloudflared tunnel --url http://localhost:3000
```

Copie a URL gerada para `NEXT_PUBLIC_SITE_URL` e **reinicie o `npm run dev`** —
o Next só lê `.env.local` na inicialização.

**B) Preview da Vercel (mais parecido com produção)**

Faça push de uma branch e use a URL do deploy. As variáveis vão em
_Settings → Environment Variables_. Esta opção também valida o
`outputFileTracingIncludes`, que é o que garante que o PDF vai junto na função
serverless — algo que só quebra em produção.

Depois, no painel do Mercado Pago, aponte o webhook para:

```
<sua-url>/api/webhooks/mercadopago
```

Marque o evento **Pagamentos**.

---

## 3. Cartão de teste

Os números ficam em **[Cartões de teste](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/additional-content/your-integrations/test/cards)**
(mudam de tempos em tempos; não vale decorar).

O truque útil: **o resultado é controlado pelo NOME do titular**, não pelo
número. Digite no campo de nome:

| Nome   | Resultado                        |
| ------ | -------------------------------- |
| `APRO` | aprovado                         |
| `OTHE` | recusado por erro geral          |
| `FUND` | recusado por saldo insuficiente  |
| `SECU` | recusado por código de segurança |
| `EXPI` | recusado por vencimento          |
| `CONT` | pendente / em análise            |

Use CPF `12345678909` e qualquer validade futura.

Vale rodar `APRO` **e** pelo menos um recusado — a tela de recusa é a que ninguém
testa e a que mais aparece na vida real.

---

## 4. Pix no sandbox

**Atenção:** o Pix de sandbox **não aprova sozinho**. O QR é gerado e o pagamento
fica `pending` para sempre se você não fizer nada. Duas formas de aprovar:

- **Usuários de teste**: crie um vendedor e um comprador em _Suas integrações →
  Usuários de teste_, use as credenciais do vendedor na aplicação e pague com a
  conta do comprador.
- **Forçar o status pela API**, útil para testar só o webhook:

```bash
curl -X PUT https://api.mercadopago.com/v1/payments/<PAYMENT_ID> \
  -H "Authorization: Bearer $MERCADOPAGO_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"approved"}'
```

Isso dispara a notificação real e você vê o fluxo completo acontecer.

---

## 5. Checklist ponta a ponta

Marque na ordem. Cada item falha por um motivo diferente.

### Pix

- [ ] `/checkout` com nome e e-mail válidos → o QR aparece
- [ ] O código copia-e-cola funciona no botão "Copiar código"
- [ ] O cronômetro de expiração conta para trás (30 min)
- [ ] Aprovar o pagamento (seção 4)
- [ ] **Webhook chega**: `POST /api/webhooks/mercadopago` → `200 {"delivered":true}`
- [ ] **E-mail chega** com o botão "Baixar meu guia"
- [ ] O link do e-mail abre o PDF (`Content-Type: application/pdf`)
- [ ] `/obrigado?payment_id=<ID>` mostra "Pagamento confirmado" e o botão baixa

### Cartão

- [ ] Os campos do Brick carregam (se aparecer "indisponível", falta a `PUBLIC_KEY`)
- [ ] Titular `APRO` → tela "Pagamento aprovado"
- [ ] Titular `FUND` → mensagem de recusa, **sem** liberar download
- [ ] Titular `CONT` → tela "Pagamento em análise"
- [ ] O e-mail chega no caso aprovado

### Segurança — o que não pode funcionar

- [ ] `POST` no webhook **sem** `x-signature` → `401`
- [ ] `POST` no webhook com assinatura errada → `401`
- [ ] Token de download com um caractere alterado → `403`
- [ ] `/obrigado?payment_id=<id-de-outra-pessoa>` → não gera link válido
- [ ] Enviar `{"transaction_amount": 0.01}` no corpo de `/api/checkout` → o valor
      cobrado continua **R$ 29,90**
- [ ] Acessar `/private/guia-pais-de-primeira-viagem.pdf` no navegador → `404`

Os quatro primeiros já foram verificados localmente com `curl`. Os dois últimos
só dá para confirmar com credencial ativa.

### Expiração do link

O TTL é de 7 dias — esperar não é viável. Para testar de verdade, reduza
`DOWNLOAD_TTL_SECONDS` em `src/lib/download-token.ts` para `60`, gere um link,
espere um minuto e confirme:

- [ ] Antes de 1 min → `200` e o PDF baixa
- [ ] Depois de 1 min → `410` com a mensagem de link expirado

**Devolva o valor para `7 * 24 * 60 * 60` depois.** Há um teste automatizado
(`download-token.test.ts`) que trava esse número — ele vai falhar se você
esquecer, o que é de propósito.

---

## 6. Antes de ir para produção

- [ ] Trocar as credenciais `TEST-` pelas de **produção**
- [ ] `DOWNLOAD_TOKEN_SECRET` novo, gerado direto na Vercel
- [ ] Domínio do remetente **verificado** no Resend (sem isso o e-mail só chega
      para o dono da conta, e falha calada)
- [ ] `NEXT_PUBLIC_SITE_URL` com o domínio real
- [ ] Webhook do painel apontando para o domínio real
- [ ] **Substituir `private/guia-pais-de-primeira-viagem.pdf`** pelo PDF do
      cliente — hoje é um placeholder de 4 linhas
- [ ] Fazer uma compra real de R$ 29,90 e pedir estorno; é o único teste que
      prova que a credencial de produção está certa
