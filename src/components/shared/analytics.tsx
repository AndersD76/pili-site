"use client";

import Script from "next/script";
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
 */
export function Analytics() {
  const consent = useCookieConsent();

  if (consent !== "accepted") return null;

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

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
