"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { uploadMedia, deleteMedia } from "@/app/admin/(panel)/media/actions";
import {
  ACCEPT_ATTRIBUTE,
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_LABEL,
  mediaUrl,
} from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface MediaItem {
  id: string;
  filename: string;
  alt: string | null;
}

interface MediaUploaderProps {
  /** Fotos já vinculadas à entidade. */
  initialItems?: MediaItem[];
  /** Vínculo. Sem nenhum, o arquivo entra solto na biblioteca. */
  productId?: string;
  caseId?: string;
  postId?: string;
  label?: string;
  help?: string;
}

/**
 * Envio e listagem de fotos de uma entidade do CMS.
 *
 * Os arquivos vão para o Postgres e são servidos por `/api/media/[id]`. O
 * campo de descrição não é decorativo: sem `alt` a imagem não é lida por
 * leitores de tela nem indexada pelo Google.
 */
export function MediaUploader({
  initialItems = [],
  productId,
  caseId,
  postId,
  label = "Fotos",
  help,
}: MediaUploaderProps) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [alt, setAlt] = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Arquivo acima de ${MAX_FILE_SIZE_LABEL}.`);
      return;
    }

    const formData = new FormData();
    formData.set("file", file);
    formData.set("alt", alt);

    startTransition(async () => {
      try {
        const result = await uploadMedia(formData, { productId, caseId, postId });
        if (result.success && result.media) {
          setItems((prev) => [...prev, result.media!]);
          setAlt("");
          if (inputRef.current) inputRef.current.value = "";
          toast.success("Foto enviada.");
        } else {
          toast.error(result.error ?? "Erro ao enviar a foto.");
        }
      } catch {
        toast.error("Não foi possível enviar a foto.");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        const result = await deleteMedia(id);
        if (result.success) {
          setItems((prev) => prev.filter((i) => i.id !== id));
          toast.success("Foto removida.");
        } else {
          toast.error(result.error ?? "Erro ao remover.");
        }
      } catch {
        toast.error("Não foi possível remover a foto.");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-lg font-semibold text-pili-black">
          {label}
        </h3>
        <p className="mt-1 text-sm text-pili-concrete">
          {help ??
            `JPG, PNG, WebP ou AVIF, até ${MAX_FILE_SIZE_LABEL}. Descreva a imagem para leitores de tela e para o Google.`}
        </p>
      </div>

      {items.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="group relative overflow-hidden rounded-lg border border-pili-mist bg-pili-paper"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl(item.id)}
                alt={item.alt ?? item.filename}
                width={320}
                height={240}
                loading="lazy"
                className="aspect-4/3 w-full object-cover"
              />
              <div className="flex items-center justify-between gap-2 p-2">
                <span className="truncate text-xs text-pili-concrete">
                  {item.alt ?? item.filename}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  disabled={isPending}
                  onClick={() => handleDelete(item.id)}
                  className="shrink-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Remover {item.filename}</span>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-2">
        <Label htmlFor="media-alt">Descrição da próxima foto</Label>
        <Input
          id="media-alt"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Tombador de 30 metros descarregando soja no Porto de Paranaguá"
          disabled={isPending}
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          className="sr-only"
          id="media-file"
          disabled={isPending}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          {isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <ImagePlus className="mr-2 size-4" />
          )}
          {isPending ? "Enviando..." : "Adicionar foto"}
        </Button>
      </div>
    </div>
  );
}
