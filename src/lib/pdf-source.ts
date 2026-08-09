import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Origem do PDF do guia.
 *
 * DECISÃO: o arquivo vive no repositório, FORA de public/.
 *
 * Fora de public/ porque tudo que está lá é servido por URL direta — o PDF
 * seria baixável sem pagar e o token HMAC viraria decoração.
 *
 * No repositório (e não num bucket) porque é um arquivo só, de poucos MB, que
 * muda raramente. Um serviço de storage acrescentaria token, conta e ponto de
 * falha a um projeto cuja premissa é justamente não ter infraestrutura de
 * estado.
 *
 * Se o PDF crescer muito ou passar a mudar toda semana, a conta inverte. Por
 * isso toda a leitura está atrás desta função: migrar para Vercel Blob ou S3
 * é reescrever só este arquivo.
 */

const PDF_PATH = join(
  process.cwd(),
  'private',
  'guia-pais-de-primeira-viagem.pdf'
);

export const PDF_FILENAME = 'Pais de Primeira Viagem - Guia Completo.pdf';

export type PdfResult =
  { ok: true; bytes: Buffer } | { ok: false; reason: 'not_found' };

export async function readGuidePdf(): Promise<PdfResult> {
  try {
    return { ok: true, bytes: await readFile(PDF_PATH) };
  } catch {
    // O arquivo real é entregue pelo cliente. Enquanto não chega, a rota
    // responde 503 em vez de estourar 500 — falha honesta, não erro.
    return { ok: false, reason: 'not_found' };
  }
}
