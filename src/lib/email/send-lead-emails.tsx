import { getResend, FROM_EMAIL, LEAD_NOTIFY_EMAIL } from "./client";
import { LeadNotificationEmail } from "./templates/lead-notification";
import { LeadConfirmationEmail } from "./templates/lead-confirmation";
import { logError } from "@/lib/prisma-errors";

interface SendLeadEmailsInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  application?: string;
  productInterest?: string;
  message?: string;
  source: string;
  pageUrl?: string;
  locale?: string;
}

/**
 * Notifica o comercial e confirma o recebimento ao lead.
 *
 * Nunca lança: o lead já está gravado quando isto roda, e uma falha do Resend
 * não pode transformar um cadastro bem-sucedido em erro para o visitante.
 */
export async function sendLeadEmails(input: SendLeadEmailsInput) {
  const resend = getResend();

  if (!resend) {
    logError(
      "LEAD_EMAIL_SKIPPED",
      new Error("RESEND_API_KEY ausente — emails do lead não enviados"),
    );
    return;
  }

  const {
    name,
    email,
    phone,
    company,
    application,
    productInterest,
    message,
    source,
    pageUrl,
    locale,
  } = input;

  const results = await Promise.allSettled([
    resend.emails.send({
      from: FROM_EMAIL,
      to: LEAD_NOTIFY_EMAIL,
      replyTo: email,
      subject: `Novo lead: ${name}${company ? ` — ${company}` : ""}`,
      react: (
        <LeadNotificationEmail
          name={name}
          email={email}
          phone={phone}
          company={company}
          application={application}
          productInterest={productInterest}
          message={message}
          source={source}
          pageUrl={pageUrl}
        />
      ),
    }),
    resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Recebemos seu contato — PILI Industrial",
      react: <LeadConfirmationEmail name={name} locale={locale} />,
    }),
  ]);

  results.forEach((result, index) => {
    const label = index === 0 ? "LEAD_EMAIL_NOTIFY" : "LEAD_EMAIL_CONFIRM";

    if (result.status === "rejected") {
      logError(label, result.reason);
      return;
    }

    // O SDK do Resend devolve o erro no payload em vez de lançar.
    if (result.value.error) {
      logError(label, result.value.error);
    }
  });
}
