import { Resend } from "resend";
import { COMPANY } from "@/lib/constants";

/** `undefined` = ainda não inicializado; `null` = sem RESEND_API_KEY. */
const globalForResend = globalThis as unknown as {
  resend: Resend | null | undefined;
};

/**
 * Instanciação preguiçosa: o construtor do Resend lança quando a chave está
 * ausente, então criá-lo no topo do módulo quebrava o build de qualquer rota
 * que importasse este arquivo sem a variável configurada.
 */
export function getResend(): Resend | null {
  if (globalForResend.resend === undefined) {
    const apiKey = process.env.RESEND_API_KEY;
    const client = apiKey ? new Resend(apiKey) : null;

    if (process.env.NODE_ENV !== "production") {
      globalForResend.resend = client;
    }

    return client;
  }

  return globalForResend.resend;
}

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? COMPANY.emailRemetente;
export const LEAD_NOTIFY_EMAIL =
  process.env.LEAD_NOTIFY_EMAIL ?? COMPANY.emailComercial;
