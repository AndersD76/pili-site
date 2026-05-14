import { Resend } from "resend";

const globalForResend = globalThis as unknown as {
  resend: Resend | undefined;
};

export const resend =
  globalForResend.resend ??
  new Resend(process.env.RESEND_API_KEY);

if (process.env.NODE_ENV !== "production") globalForResend.resend = resend;

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "contato@pili.ind.br";
export const LEAD_NOTIFY_EMAIL =
  process.env.LEAD_NOTIFY_EMAIL ?? "comercial@pili.ind.br";
