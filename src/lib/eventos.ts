/**
 * Eventos de conversão do GA4.
 *
 * Só envia se o gtag estiver carregado — e ele só carrega depois do aceite no
 * aviso de cookies (`components/shared/analytics.tsx`). Sem aceite a chamada
 * não faz nada, então quem chama não precisa conferir o consentimento.
 *
 * `generate_lead` e `whatsapp_click` devem ser marcados como "eventos
 * principais" no painel do GA4; os demais servem para entender o funil.
 */

type Evento =
  | "generate_lead"
  | "whatsapp_click"
  | "file_download"
  | "catalogo_folhear"
  | "calculadora_calcular";

type Parametros = Record<string, string | number | undefined>;

declare global {
  interface Window {
    gtag?: (comando: "event", nome: string, parametros?: Parametros) => void;
  }
}

export function registrarEvento(nome: Evento, parametros?: Parametros): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", nome, parametros);
}
