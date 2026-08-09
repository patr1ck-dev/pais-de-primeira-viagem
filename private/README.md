# private/

O PDF do guia mora aqui, **fora de `public/`**.

Qualquer arquivo em `public/` é servido por URL direta — o guia seria baixável
sem pagar e o token HMAC de `/download/[token]` viraria decoração. Só a rota
`src/app/download/[token]/route.ts` lê esta pasta, e só depois de conferir
assinatura e expiração.

O arquivo versionado hoje é um **placeholder** de 4 linhas. Substitua por
`guia-pais-de-primeira-viagem.pdf` (o PDF real do cliente) mantendo o nome.

Se o PDF passar de ~25MB ou virar arquivo que muda toda semana, vale migrar
para Vercel Blob ou S3: toda a leitura está isolada em `src/lib/pdf-source.ts`,
então é reescrever só aquele arquivo.
