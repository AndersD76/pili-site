/**
 * Chave do consentimento de cookies no `localStorage`.
 *
 * Fica fora de `cookie-banner.tsx` porque o layout (Server Component) também
 * precisa dela: importar de um módulo "use client" entregaria ao servidor uma
 * referência de cliente, não o texto.
 */
export const CONSENT_KEY = "pili-cookie-consent";
