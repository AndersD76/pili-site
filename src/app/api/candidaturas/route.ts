import { NextRequest, NextResponse } from "next/server";
import { jobApplicationFormSchema } from "@/lib/validators/lead";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logError } from "@/lib/prisma-errors";
import { db } from "@/lib/db";
import { detectCvType, MAX_CV_SIZE } from "@/lib/media";

// Prisma não roda no edge runtime.
export const runtime = "nodejs";

/**
 * Recebe candidaturas do formulário "Trabalhe conosco".
 *
 * Antes o formulário postava em `/api/leads` e a candidatura virava um `Lead`
 * com `company: "Candidato"` e a área concatenada dentro da mensagem: ficava
 * misturada ao funil comercial, sem lugar para o currículo e contando como
 * lead nas métricas do painel. Agora grava em `JobApplication`, com o currículo
 * no próprio banco.
 *
 * O corpo é `multipart/form-data` por causa do arquivo.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request) ?? "unknown";
    const rate = await checkRateLimit(ip);
    if (!rate.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );
    }

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const parsed = jobApplicationFormSchema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      area: form.get("area"),
      message: form.get("message") || undefined,
      consent: form.get("consent") === "true",
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    // ---- currículo (opcional) ----
    const arquivo = form.get("cv");
    let cv: {
      cvData: Buffer;
      cvFilename: string;
      cvMimeType: string;
      cvSize: number;
    } | null = null;

    if (arquivo instanceof File && arquivo.size > 0) {
      if (arquivo.size > MAX_CV_SIZE) {
        return NextResponse.json({ error: "Arquivo grande" }, { status: 413 });
      }

      const bytes = Buffer.from(await arquivo.arrayBuffer());
      // O `type` vindo do navegador é forjável; vale o que dizem os bytes.
      const tipo = detectCvType(bytes);
      if (!tipo) {
        return NextResponse.json(
          { error: "Formato não aceito" },
          { status: 415 },
        );
      }

      cv = {
        cvData: bytes,
        cvFilename: arquivo.name.slice(0, 200),
        cvMimeType: tipo,
        cvSize: bytes.length,
      };
    }

    const { name, email, phone, area, message } = parsed.data;

    await db.jobApplication.create({
      data: {
        name,
        email,
        phone,
        area,
        message: message ?? null,
        // O consentimento é registrado com data porque a LGPD exige comprovar
        // quando foi dado, não apenas que existe.
        consentAt: new Date(),
        ...cv,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    logError("CANDIDATURA_CREATE", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
