"use client";

import { useTranslations } from "next-intl";
import { useCookieConsent } from "./cookie-banner";
import { WhatsAppIcon } from "./brand-icons";
import { Giorgia } from "./giorgia";

/**
 * Botões flutuantes do canto inferior.
 *
 * Existiam soltos no layout, cada um com um `bottom-6` próprio e um `z-index`
 * diferente: o banner de cookies é `fixed bottom-0` de largura total em `z-50`
 * e cobria o botão do WhatsApp (`z-40`) e disputava camada com a GiorgIA. Aqui
 * os dois compartilham a mesma reserva vertical — `--fab-bottom`, que cresce
 * enquanto o banner está na tela — e ficam abaixo dele na pilha.
 */
export function FloatingWidgets({ whatsapp }: { whatsapp: string }) {
  const t = useTranslations("floating");
  const consent = useCookieConsent();

  const url = `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    t("whatsappMessage"),
  )}`;

  return (
    // `contents` não cria caixa própria: os filhos seguem `fixed` em relação à
    // viewport e apenas herdam a variável. Enquanto o banner está na tela ele
    // reserva a própria altura mais o respiro de 1.5rem.
    <div
      className={
        consent === "none"
          ? "contents [--fab-bottom:11rem] sm:[--fab-bottom:7.5rem]"
          : "contents [--fab-bottom:1.5rem]"
      }
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-(--fab-bottom) left-6 z-40 flex h-20 w-20 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.4)] transition-all hover:scale-110 hover:shadow-[0_6px_24px_rgba(37,211,102,0.5)]"
        aria-label={t("whatsappLabel")}
      >
        <WhatsAppIcon className="h-10 w-10" />
      </a>

      <Giorgia whatsapp={whatsapp} />
    </div>
  );
}
