import { requireRole } from "@/lib/auth-guard";
import { listMedia } from "./actions";
import { MediaLibrary } from "@/components/admin/media-library";

export const metadata = { title: "Biblioteca de mídia" };

export default async function MediaPage() {
  await requireRole("ADMIN", "COMERCIAL");

  const { items, error } = await listMedia();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-pili-black">
          Biblioteca de mídia
        </h1>
        <p className="text-sm text-pili-concrete">
          {items.length}{" "}
          {items.length === 1 ? "arquivo enviado" : "arquivos enviados"}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {error}
        </div>
      )}

      <MediaLibrary
        items={items.map((i) => ({
          id: i.id,
          filename: i.filename,
          mimeType: i.mimeType,
          size: i.size,
          alt: i.alt,
          createdAt: i.createdAt.toISOString(),
          vinculo: i.product?.slug ?? i.case?.slug ?? i.post?.slug ?? null,
        }))}
      />
    </div>
  );
}
