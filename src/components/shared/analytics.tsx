"use client";

import { useEffect } from "react";
import Script from "next/script";
import { registrarEvento } from "@/lib/eventos";
import { useCookieConsent } from "./cookie-banner";

/**
 * Carrega o rastreamento **somente após consentimento explícito**.
 *
 * Antes as variáveis de GA/Meta Pixel só apareciam como texto na tela de
 * configurações do admin — nenhuma medição existia de fato. O banner de cookies,
 * por sua vez, gravava a escolha no `localStorage` e nada a lia.
 *
 * O `@vercel/analytics` saiu daqui: o site roda no Railway, então o script
 * `/_vercel/insights/script.js` respondia 404 e sujava o console de todo
 * visitante sem medir nada.
 *
 * Os IDs chegam por prop, lidos do ambiente pelo layout no servidor. Assim
 * trocar a medição é reiniciar o serviço, não rebuildar: variável
 * `NEXT_PUBLIC_` fica gravada dentro do bundle no momento do build, e mais de
 * uma configuração já se perdeu nessa pegadinha.
 */
export function Analytics({
  gaId,
  pixelId,
}: {
  gaId?: string;
  pixelId?: string;
}) {
  const consent = useCookieConsent();
  const medindo = consent === "accepted" && Boolean(gaId);

  /*
   * Um ouvinte só para os links de WhatsApp: os botões existem em dezenas de
   * componentes, inclusive nas milhares de páginas de mercado de grãos, e
   * marcar cada um espalharia a medição pelo código.
   */
  useEffect(() => {
    if (!medindo) return;
    function aoClicar(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const href = link.href;
      if (/wa\.me|api\.whatsapp\.com/.test(href)) {
        registrarEvento("whatsapp_click", { pagina: window.location.pathname });
      }
    }
    document.addEventListener("click", aoClicar, { capture: true });
    return () => document.removeEventListener("click", aoClicar, { capture: true });
  }, [medindo]);

  if (consent !== "accepted") return null;

  return (
    <>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {pixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
