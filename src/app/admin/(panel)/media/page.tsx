import { Upload, ImageIcon, Film, FileIcon } from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function getMediaIcon(type: string) {
  if (type.startsWith("image/")) return ImageIcon;
  if (type.startsWith("video/")) return Film;
  return FileIcon;
}

function isImageType(type: string) {
  return type.startsWith("image/");
}

function extractFilename(url: string) {
  try {
    const parts = url.split("/");
    return decodeURIComponent(parts[parts.length - 1] ?? url);
  } catch {
    return url;
  }
}

export default async function MediaPage() {
  await requireRole("ADMIN");

  const mediaItems = await db.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { product: true, case: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-pili-black">
            Biblioteca de mídia
          </h1>
          <p className="text-sm text-pili-concrete">
            Gerencie arquivos de mídia do site
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0}>
                <Button disabled>
                  <Upload className="size-4" />
                  Upload
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Em breve</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {mediaItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-pili-mist bg-pili-white py-16">
          <ImageIcon className="size-12 text-pili-concrete" />
          <p className="mt-4 text-sm font-medium text-pili-concrete">
            Nenhuma mídia cadastrada
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mediaItems.map((item) => {
            const Icon = getMediaIcon(item.type);
            const associatedName =
              item.product?.slug ?? item.case?.client ?? null;
            const associatedLabel = item.product
              ? "Produto"
              : item.case
                ? "Obra"
                : null;

            return (
              <div
                key={item.id}
                className="group overflow-hidden rounded-lg border border-pili-mist bg-pili-white transition-shadow hover:shadow-md"
              >
                <div className="relative flex h-40 items-center justify-center bg-pili-paper">
                  {isImageType(item.type) ? (
                    <img
                      src={item.url}
                      alt={item.alt ?? ""}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Icon className="size-12 text-pili-concrete" />
                  )}
                </div>

                <div className="space-y-1 p-3">
                  <p
                    className="truncate text-sm font-medium text-pili-black"
                    title={item.alt ?? extractFilename(item.url)}
                  >
                    {item.alt ?? extractFilename(item.url)}
                  </p>

                  <p className="text-xs text-pili-concrete">{item.type}</p>

                  {item.width && item.height && (
                    <p className="text-xs text-pili-concrete">
                      {item.width} x {item.height}
                    </p>
                  )}

                  {associatedName && associatedLabel && (
                    <p className="truncate text-xs text-pili-concrete">
                      {associatedLabel}: {associatedName}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
