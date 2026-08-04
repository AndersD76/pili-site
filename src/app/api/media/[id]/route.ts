import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logError } from "@/lib/prisma-errors";

export const runtime = "nodejs";

/**
 * Entrega um arquivo de mídia guardado no banco.
 *
 * Rota **pública**: as imagens aparecem no site institucional. O cache é
 * `immutable` porque o id nunca muda para o mesmo arquivo — trocar a foto gera
 * um id novo. Assim o banco é lido uma vez e o CDN atende o resto.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const media = await db.media.findUnique({
      where: { id },
      select: { data: true, mimeType: true, size: true, filename: true },
    });

    if (!media) {
      return new NextResponse("Not found", { status: 404 });
    }

    return new NextResponse(new Uint8Array(media.data), {
      status: 200,
      headers: {
        "Content-Type": media.mimeType,
        "Content-Length": String(media.size),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": `inline; filename="${encodeURIComponent(media.filename)}"`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    logError("MEDIA_SERVE", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
