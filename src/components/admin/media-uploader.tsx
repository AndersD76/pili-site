"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Loader2,
  Star,
  Trash2,
} from "lucide-react";
import {
  uploadMedia,
  deleteMedia,
  reorderMedia,
} from "@/app/admin/(panel)/media/actions";
import {
  ACCEPT_ATTRIBUTE,
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_LABEL,
  mediaUrl,
} from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

export interface MediaItem {
  id: string;
  filename: string;
  alt: string | null;
}

interface MediaUploaderProps {
  initialItems?: MediaItem[];
  productId?: string;
  caseId?: string;
  postId?: string;
  heroSlideId?: string;
  setorSlug?: string;
  label?: string;
  help?: string;
}

/**
 * Envio, ordenação e exclusão das fotos de uma entidade do CMS.
 *
 * A **primeira** da lista é a imagem principal: é ela que aparece no card da
 * listagem e no cartão de compartilhamento. A ordem é persistida em
 * `Media.order`, então o que se vê aqui é o que o site usa.
 */
export function MediaUploader({
  initialItems = [],
  productId,
  caseId,
  postId,
  heroSlideId,
  setorSlug,
  label = "Fotos",
  help,
}: MediaUploaderProps) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [alt, setAlt] = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  /** Envia em série: o `order` de cada foto depende da anterior já existir. */
  function enviarArquivos(files: File[]) {
    const validos = files.filter((f) => {
      if (f.size > MAX_FILE_SIZE) {
        toast.error(`${f.name}: acima de ${MAX_FILE_SIZE_LABEL}.`);
        return false;
      }
      return true;
    });

    if (validos.length === 0) return;

    startTransition(async () => {
      const novos: MediaItem[] = [];

      for (const file of validos) {
        const formData = new FormData();
        formData.set("file", file);
        // A descrição digitada vale para a primeira; as demais herdam o nome.
        formData.set("alt", novos.length === 0 ? alt : "");

        try {
          const result = await uploadMedia(formData, {
            productId,
            caseId,
            postId,
            heroSlideId,
            setorSlug,
          });
          if (result.success && result.media) {
            novos.push(result.media);
          } else {
            toast.error(`${file.name}: ${result.error ?? "erro ao enviar"}`);
          }
        } catch {
          toast.error(`${file.name}: falha no envio.`);
        }
      }

      if (novos.length > 0) {
        setItems((prev) => [...prev, ...novos]);
        setAlt("");
        if (inputRef.current) inputRef.current.value = "";
        toast.success(
          novos.length === 1
            ? "Foto enviada."
            : `${novos.length} fotos enviadas.`,
        );
      }
    });
  }

  function persistirOrdem(novaOrdem: MediaItem[]) {
    setItems(novaOrdem);
    startTransition(async () => {
      try {
        const result = await reorderMedia(novaOrdem.map((i) => i.id));
        if (!result.success) {
          toast.error(result.error ?? "Erro ao reordenar.");
        }
      } catch {
        toast.error("Não foi possível salvar a ordem.");
      }
    });
  }

  function mover(index: number, direcao: -1 | 1) {
    const destino = index + direcao;
    if (destino < 0 || destino >= items.length) return;
    const copia = [...items];
    [copia[index], copia[destino]] = [copia[destino]!, copia[index]!];
    persistirOrdem(copia);
  }

  function tornarPrincipal(index: number) {
    if (index === 0) return;
    const copia = [...items];
    const [item] = copia.splice(index, 1);
    persistirOrdem([item!, ...copia]);
  }

  function excluir(id: string) {
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
            `JPG, PNG, WebP ou AVIF, até ${MAX_FILE_SIZE_LABEL} cada. Você pode selecionar várias de uma vez.`}
        </p>
        {items.length > 1 && (
          <p className="mt-1 text-sm text-pili-concrete">
            A <strong>primeira</strong> é a imagem principal — use as setas ou a
            estrela para reordenar.
          </p>
        )}
      </div>

      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-pili-mist bg-pili-white p-2"
            >
              <div className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(item.id)}
                  alt={item.alt ?? item.filename}
                  width={96}
                  height={72}
                  loading="lazy"
                  className="h-16 w-24 rounded bg-pili-paper object-cover"
                />
                {index === 0 && (
                  <span className="absolute -left-1 -top-1 rounded-full bg-pili-safety px-1.5 py-0.5 text-[10px] font-bold uppercase text-pili-white">
                    Principal
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-pili-black">
                  {item.filename}
                </p>
                <p className="truncate text-xs text-pili-concrete">
                  {item.alt ?? "Sem descrição"}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  disabled={isPending || index === 0}
                  onClick={() => tornarPrincipal(index)}
                  title="Tornar principal"
                >
                  <Star className="size-4" />
                  <span className="sr-only">Tornar {item.filename} a principal</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  disabled={isPending || index === 0}
                  onClick={() => mover(index, -1)}
                >
                  <ChevronUp className="size-4" />
                  <span className="sr-only">Mover para cima</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  disabled={isPending || index === items.length - 1}
                  onClick={() => mover(index, 1)}
                >
                  <ChevronDown className="size-4" />
                  <span className="sr-only">Mover para baixo</span>
                </Button>
                <ConfirmDialog
                  title="Remover foto"
                  description={`"${item.filename}" será excluída permanentemente e deixa de aparecer no site.`}
                  confirmLabel="Remover foto"
                  onConfirm={() => excluir(item.id)}
                  trigger={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      disabled={isPending}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Remover {item.filename}</span>
                    </Button>
                  }
                />
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
        <p className="text-xs text-pili-concrete">
          Sem descrição a imagem não é lida por leitores de tela nem indexada
          pelo Google.
        </p>
      </div>

      <div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          multiple
          className="sr-only"
          id="media-file"
          disabled={isPending}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length > 0) enviarArquivos(files);
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
          {isPending ? "Enviando..." : "Adicionar fotos"}
        </Button>
      </div>
    </div>
  );
}
