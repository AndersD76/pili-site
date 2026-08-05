import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, AuthorizationError } from "@/lib/auth-guard";
import { logError } from "@/lib/prisma-errors";

export const runtime = "nodejs";

/**
 * Entrega o currículo de uma candidatura.
 *
 * Ao contrário de `/api/media/[id]`, esta rota é **privada**: currículo é dado
 * pessoal e só pode ser lido por quem administra o painel. Por isso também não
 * há cache público e o arquivo desce como anexo, nunca renderizado inline.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // `requireAdmin` lança em vez de redirecionar: num route handler o throw
  // viraria 500, que é a resposta errada para quem não está autenticado.
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AuthorizationError) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    throw err;
  }

  const { id } = await params;

  try {
    const candidatura = await db.jobApplication.findUnique({
      where: { id },
      select: {
        cvData: true,
        cvMimeType: true,
        cvSize: true,
        cvFilename: true,
        deletedAt: true,
      },
    });

    if (!candidatura?.cvData || candidatura.deletedAt) {
      return new NextResponse("Not found", { status: 404 });
    }

    return new NextResponse(new Uint8Array(candidatura.cvData), {
      status: 200,
      headers: {
        "Content-Type": candidatura.cvMimeType ?? "application/octet-stream",
        "Content-Length": String(candidatura.cvSize ?? candidatura.cvData.length),
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          candidatura.cvFilename ?? "curriculo",
        )}"`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    logError("CANDIDATURA_CV", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
