import { NextRequest, NextResponse } from "next/server";
import {
  leadRequestSchema,
  type LeadSourceLiteral,
} from "@/lib/validators/lead";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendLeadEmails } from "@/lib/email/send-lead-emails";
import { logError } from "@/lib/prisma-errors";
import { db } from "@/lib/db";
import type { LeadSource } from "@prisma/client";

// Prisma e bcrypt não rodam no edge runtime.
export const runtime = "nodejs";

/**
 * Trava de compilação nas duas direções entre o enum do Prisma e os literais do
 * validador. Sem a segunda direção, um valor adicionado só ao Prisma passaria
 * despercebido e jamais poderia ser enviado pelo site — foi exatamente o que
 * aconteceu com `TRABALHE_CONOSCO`.
 */
type AssertSourcesMatch = [LeadSource] extends [LeadSourceLiteral]
  ? [LeadSourceLiteral] extends [LeadSource]
    ? true
    : never
  : never;
const _assertSourcesMatch: AssertSourcesMatch = true;
void _assertSourcesMatch;

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request) ?? "unknown";
    const rate = await checkRateLimit(ip);

    if (!rate.success) {
      if (rate.reason === "unconfigured") {
        logError(
          "LEADS_RATE_LIMIT",
          new Error("Upstash não configurado em produção — requisição recusada"),
        );
        return NextResponse.json(
          { error: "Service unavailable" },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = leadRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const { consent, source, pageUrl, utm, ...leadData } = parsed.data;

    // Falha de compilação se `LeadSource` divergir dos literais do validador.
    const leadSource: LeadSource = source;

    const lead = await db.lead.create({
      data: {
        ...leadData,
        source: leadSource,
        pageUrl,
        utm,
        // `consent` é obrigatório no schema; registramos quando foi dado para
        // ter prova do aceite (LGPD).
        consentAt: consent ? new Date() : null,
      },
      select: { id: true },
    });

    // O lead já está persistido — email é best-effort e não altera a resposta.
    await sendLeadEmails({
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      company: leadData.company,
      application: leadData.application,
      productInterest: leadData.productInterest,
      message: leadData.message,
      source: leadSource,
      pageUrl,
    });

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (error) {
    // Sem o corpo da requisição: contém dados pessoais do lead.
    logError("LEADS_POST", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
