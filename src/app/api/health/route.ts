import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logError } from "@/lib/prisma-errors";

export const runtime = "nodejs";
// Healthcheck precisa refletir o estado agora, nunca uma resposta em cache.
export const dynamic = "force-dynamic";

/**
 * Verificação de saúde da aplicação e do banco.
 *
 * Sem isto, nenhum monitor externo tinha alvo barato: `GET /` responde 200 mesmo
 * com o banco fora do ar, porque o site público não o consulta. A queda só
 * aparecia como 404 no detalhe do lead e zeros no dashboard — sintomas que
 * parecem perda de dados, não indisponibilidade.
 *
 * A resposta não expõe detalhe de infraestrutura: apenas o estado.
 */
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json(
      { status: "ok", database: "up" },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    logError("HEALTHCHECK", err);
    return NextResponse.json(
      { status: "degraded", database: "down" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
