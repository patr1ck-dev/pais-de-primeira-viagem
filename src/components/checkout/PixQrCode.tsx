/**
 * Área do QR code do Pix.
 *
 * ⚠️ PONTO DE INTEGRAÇÃO — Fase 4. O Mercado Pago devolve o QR como base64 e
 * o "copia e cola" como string; os dois entram aqui depois que /api/checkout
 * criar a cobrança. Até lá, mostra só a explicação do fluxo.
 */
export function PixQrCode() {
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
