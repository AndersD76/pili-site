"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { addNote } from "@/app/admin/(panel)/leads/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/**
 * Formulário de nota do lead.
 *
 * Antes era um `<form action={serverAction}>` inline: o botão continuava
 * habilitado durante o envio (dois cliques criavam duas notas) e uma nota só
 * com espaços era descartada em silêncio.
 */
export function AddNoteForm({ leadId }: { leadId: string }) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmed = content.trim();
    if (!trimmed) {
      toast.error("Escreva algo antes de salvar a nota.");
      textareaRef.current?.focus();
      return;
    }

    startTransition(async () => {
      try {
        const result = await addNote(leadId, trimmed);
        if (result.success) {
          setContent("");
          toast.success("Nota adicionada.");
        } else {
          toast.error(result.error ?? "Erro ao adicionar nota.");
        }
      } catch {
        toast.error("Não foi possível adicionar a nota.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Adicionar uma nota..."
        className="min-h-[80px]"
        disabled={isPending}
      />
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Salvando..." : "Adicionar nota"}
      </Button>
    </form>
  );
}
