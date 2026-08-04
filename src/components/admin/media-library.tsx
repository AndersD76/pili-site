"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { ImageIcon, ImagePlus, Loader2, Trash2, Check } from "lucide-react";
import {
  uploadMedia,
  deleteMedia,
  updateMediaAlt,
} from "@/app/admin/(panel)/media/actions";
import {
  ACCEPT_ATTRIBUTE,
  MAX_FILE_SIZE_LABEL,
  formatFileSize,
  mediaUrl,
} from "@/lib/media";
import { formatDate } from "@/lib/datetime";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

export interface LibraryItem {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  alt: string | null;
  createdAt: string;
  /** Slug da entidade a que o arquivo pertence, se houver. */
  vinculo: string | null;
}

/**
 * Biblioteca de mídia.
 *
 * A tela existia e listava uma tabela que nada populava — não havia rota de
 * upload em lugar nenhum do projeto. Agora envia, renomeia a descrição e
 * exclui.
 */
export function MediaLibrary({ items: initial }: { items: LibraryItem[] }) {
  const [items, setItems] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [editando, setEditando] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function enviar(file: File) {
    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      try {
        const result = await uploadMedia(formData);
        if (result.success && result.media) {
          setItems((prev) => [
            {
              id: result.media!.id,
              filename: result.media!.filename,
              alt: result.media!.alt,
              mimeType: file.type,
              size: file.size,
              createdAt: new Date().toISOString(),
              vinculo: null,
            },
            ...prev,
          ]);
          if (inputRef.current) inputRef.current.value = "";
          toast.success("Arquivo enviado.");
        } else {
          toast.error(result.error ?? "Erro ao enviar.");
        }
      } catch {
        toast.error("Não foi possível enviar o arquivo.");
      }
    });
  }

  function salvarAlt(id: string) {
    startTransition(async () => {
      try {
        const result = await updateMediaAlt(id, rascunho);
        if (result.success) {
          setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, alt: rascunho.trim() || null } : i)),
          );
          setEditando(null);
          toast.success("Descrição atualizada.");
        } else {
          toast.error(result.error ?? "Erro ao atualizar.");
        }
      } catch {
        toast.error("Não foi possível atualizar a descrição.");
      }
    });
  }

  function excluir(id: string) {
    startTransition(async () => {
      try {
        const result = await deleteMedia(id);
        if (result.success) {
          setItems((prev) => prev.filter((i) => i.id !== id));
          toast.success("Arquivo excluído.");
        } else {
          toast.error(result.error ?? "Erro ao excluir.");
        }
      } catch {
        toast.error("Não foi possível excluir o arquivo.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          className="sr-only"
          id="library-file"
          disabled={isPending}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) enviar(file);
          }}
        />
        <Button
          type="button"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          {isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <ImagePlus className="mr-2 size-4" />
          )}
          Enviar arquivo
        </Button>
        <span className="text-xs text-pili-concrete">
          JPG, PNG, WebP ou AVIF, até {MAX_FILE_SIZE_LABEL}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-pili-concrete py-16 text-center">
          <ImageIcon className="mb-3 size-10 text-pili-concrete" />
          <p className="text-sm font-medium text-pili-graphite">
            Nenhuma mídia cadastrada
          </p>
          <p className="text-xs text-pili-concrete">
            Envie o primeiro arquivo pelo botão acima.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-lg border border-pili-mist bg-pili-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl(item.id)}
                alt={item.alt ?? item.filename}
                width={400}
                height={300}
                loading="lazy"
                className="aspect-4/3 w-full bg-pili-paper object-cover"
              />

              <div className="space-y-2 p-3">
                <p className="truncate text-sm font-medium text-pili-black">
                  {item.filename}
                </p>
                <p className="text-xs text-pili-concrete">
                  {formatFileSize(item.size)} · {formatDate(new Date(item.createdAt))}
                  {item.vinculo && ` · ${item.vinculo}`}
                </p>

                {editando === item.id ? (
                  <div className="flex gap-2">
                    <Input
                      value={rascunho}
                      onChange={(e) => setRascunho(e.target.value)}
                      placeholder="Descreva a imagem"
                      className="h-8 text-xs"
                      autoFocus
                    />
                    <Button
                      type="button"
                      size="icon-xs"
                      disabled={isPending}
                      onClick={() => salvarAlt(item.id)}
                    >
                      <Check className="size-4" />
                      <span className="sr-only">Salvar descrição</span>
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setEditando(item.id);
                      setRascunho(item.alt ?? "");
                    }}
                    className="block w-full truncate text-left text-xs text-pili-concrete underline underline-offset-2 hover:text-pili-black"
                  >
                    {item.alt ?? "Sem descrição — clique para adicionar"}
                  </button>
                )}

                <div className="flex justify-end">
                  <ConfirmDialog
                    title="Excluir arquivo"
                    description={`"${item.filename}" será removido permanentemente. Se estiver em uso em algum produto, obra ou artigo, a imagem deixa de aparecer no site.`}
                    confirmLabel="Excluir arquivo"
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
                        <span className="sr-only">Excluir {item.filename}</span>
                      </Button>
                    }
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
