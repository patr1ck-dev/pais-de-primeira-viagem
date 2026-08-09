import { NextResponse } from 'next/server';

import { verifyDownloadToken } from '@/lib/download-token';
import { PDF_FILENAME, readGuidePdf } from '@/lib/pdf-source';

export const runtime = 'nodejs';

/**
 * Valida o token assinado e serve o PDF.
 *
 * O arquivo vive fora de public/ — tudo que está lá é servido por URL direta,
 * o que tornaria o token decoração. Só esta rota lê o arquivo, e só depois de
 * conferir assinatura e expiração.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> }
): Promise<NextResponse> {
  const { token } = await context.params;

  let result;
  try {
    result = verifyDownloadToken(token);
  } catch (error) {
    console.error('[download] falha ao verificar token', error);
    return NextResponse.json({ error: 'not_configured' }, { status: 500 });
  }

  if (!result.valid) {
    // 410 no link expirado (existiu e venceu) e 403 no adulterado: a
    // diferença deixa o suporte distinguir cliente antigo de tentativa de
    // fraude, sem revelar nada útil a quem está sondando.
    const expired = result.reason === 'expired';
    return NextResponse.json(
      {
        error: result.reason,
        message: expired
          ? 'Este link expirou. Responda o e-mail da compra que reenviamos.'
          : 'Link inválido.',
      },
      { status: expired ? 410 : 403 }
    );
  }

  const pdf = await readGuidePdf();
  if (!pdf.ok) {
    console.error('[download] PDF ausente em private/');
    return NextResponse.json(
      {
        error: 'file_unavailable',
        message: 'Arquivo indisponível no momento. Já estamos verificando.',
      },
      { status: 503 }
    );
  }

  return new NextResponse(pdf.bytes as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${PDF_FILENAME}"`,
      'Content-Length': String(pdf.bytes.byteLength),
      // Link pessoal e expirável: cache compartilhado nunca deve guardá-lo.
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
