'use client';

import { useEffect, useState } from 'react';

import type { PixCheckoutResponse } from '@/lib/checkout-schema';

type PixQrCodeProps = {
  pix: PixCheckoutResponse;
};

function useCountdown(expiresAt: string | null): string | null {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!expiresAt) return;

    const target = new Date(expiresAt).getTime();
    const tick = () => {
      const remaining = target - Date.now();
      if (remaining <= 0) {
        setLabel('expirado');
        return;
      }
      const minutes = Math.floor(remaining / 60_000);
      const seconds = Math.floor((remaining % 60_000) / 1000);
      setLabel(`${minutes}:${String(seconds).padStart(2, '0')}`);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => {
      clearInterval(id);
    };
  }, [expiresAt]);

  return label;
}

/** Placeholder mostrado antes de a cobrança existir. */
export function PixPlaceholder() {
  return (
    <div className="border-line bg-surface-2 mb-[18px] rounded-[10px] border border-dashed px-4 py-5 text-center">
      <p className="text-muted text-[0.85rem]">
        O QR code do Pix aparece aqui depois de confirmar seus dados.
      </p>
      <p className="text-faint mt-1.5 text-[0.78rem]">
        O acesso é liberado assim que o pagamento for confirmado.
      </p>
    </div>
  );
}

export function PixQrCode({ pix }: PixQrCodeProps) {
  const [copied, setCopied] = useState(false);
  const countdown = useCountdown(pix.expiresAt);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => {
      setCopied(false);
    }, 2500);
    return () => {
      clearTimeout(id);
    };
  }, [copied]);

  async function copy() {
    if (!pix.qrCode) return;
    try {
      await navigator.clipboard.writeText(pix.qrCode);
      setCopied(true);
    } catch {
      // Clipboard bloqueado (http sem localhost, permissão negada): o código
      // fica visível no <textarea> para seleção manual, então não é fatal.
      setCopied(false);
    }
  }

  return (
    <div className="border-line bg-surface-2 mb-[18px] rounded-[10px] border px-4 py-5 text-center">
      <p className="mb-4 text-[0.9rem] font-semibold">
        Escaneie o QR code no app do seu banco
      </p>

      {pix.qrCodeBase64 ? (
        // O QR vem como data URI do gateway: next/image não otimiza base64 e
        // exigiria configurar domínio remoto para nada.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`data:image/png;base64,${pix.qrCodeBase64}`}
          alt="QR code para pagamento via Pix"
          width={200}
          height={200}
          className="mx-auto mb-4 rounded-lg bg-white p-2"
        />
      ) : (
        <p className="text-muted mb-4 text-[0.85rem]">
          QR code indisponível — use o código copia e cola abaixo.
        </p>
      )}

      {pix.qrCode && (
        <>
          <label
            htmlFor="pix-copia-cola"
            className="text-muted mb-1.5 block text-left text-[0.8rem] font-semibold"
          >
            Ou use o copia e cola
          </label>
          <textarea
            id="pix-copia-cola"
            readOnly
            value={pix.qrCode}
            rows={3}
            onFocus={(event) => {
              event.currentTarget.select();
            }}
            className="border-line bg-surface text-muted w-full resize-none rounded-lg border p-2.5 font-mono text-[0.7rem] break-all"
          />
          <button
            type="button"
            onClick={() => void copy()}
            className="border-accent text-accent hover:bg-accent-soft rounded-pill mt-2.5 cursor-pointer border px-4 py-2 text-[0.85rem] font-semibold transition-colors"
          >
            {copied ? 'Código copiado ✓' : 'Copiar código'}
          </button>
          <span aria-live="polite" className="sr-only">
            {copied ? 'Código Pix copiado para a área de transferência.' : ''}
          </span>
        </>
      )}

      {countdown && (
        <p className="text-faint mt-4 text-[0.78rem]">
          {countdown === 'expirado'
            ? 'Este código expirou. Recarregue a página para gerar outro.'
            : `Este código expira em ${countdown}.`}
        </p>
      )}

      <p className="text-faint mt-2 text-[0.78rem]">
        Assim que o pagamento for confirmado, o guia chega no seu e-mail.
      </p>
    </div>
  );
}
