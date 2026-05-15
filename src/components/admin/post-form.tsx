"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

import { createPost, updatePost } from "@/app/admin/blog/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import type { Post, PostTranslation } from "@prisma/client";

type PostWithRelations = Post & {
  translations: PostTranslation[];
};

const postSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug obrigatório")
    .regex(/^[a-z0-9-]+$/, "Apenas letras minúsculas, números e hífens"),
  author: z.string().min(1, "Autor obrigatório"),
  title: z.string().min(1, "Título obrigatório"),
  excerpt: z.string().min(1, "Resumo obrigatório"),
  content: z.string().min(1, "Conteúdo obrigatório"),
  tags: z.string().optional(),
  published: z.boolean(),
});

type PostFormValues = z.infer<typeof postSchema>;

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function PostForm({
  post,
}: {
  post?: PostWithRelations;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const isEditing = !!post;

  const ptTranslation = post?.translations.find((t) => t.locale === "pt_BR");

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      slug: post?.slug ?? "",
      author: post?.author ?? "PILI Industrial",
      title: ptTranslation?.title ?? "",
      excerpt: ptTranslation?.excerpt ?? "",
      content: ptTranslation?.content ?? "",
      tags: post?.tags.join(", ") ?? "",
      published: post?.published ?? false,
    },
  });

  function handleTitleBlur() {
    if (!isEditing) {
      const current = getValues("slug");
      if (!current) {
        setValue("slug", slugify(getValues("title")));
      }
    }
  }

  function onSubmit(values: PostFormValues) {
    setServerError(null);
    const formData = new FormData();
    formData.set("slug", values.slug);
    formData.set("author", values.author);
    formData.set("title", values.title);
    formData.set("excerpt", values.excerpt);
    formData.set("content", values.content);
    formData.set("tags", values.tags ?? "");
    formData.set("published", String(values.published));

    startTransition(async () => {
      const result = isEditing
        ? await updatePost(post.id, formData)
        : await createPost(formData);

      if (result.success) {
        router.push("/admin/blog");
      } else {
        setServerError(result.error ?? "Erro desconhecido");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl space-y-8 rounded-lg border border-pili-mist bg-pili-white p-6"
    >
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            {...register("title", { onBlur: handleTitleBlur })}
            placeholder="Título do artigo"
          />
          {errors.title && (
            <p className="text-xs text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            {...register("slug")}
            placeholder="titulo-do-artigo"
          />
          {errors.slug && (
            <p className="text-xs text-red-600">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="author">Autor</Label>
          <Input
            id="author"
            {...register("author")}
            placeholder="PILI Industrial"
          />
          {errors.author && (
            <p className="text-xs text-red-600">{errors.author.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
          <Input
            id="tags"
            {...register("tags")}
            placeholder="tecnologia, logística, grãos"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Resumo</Label>
        <Textarea
          id="excerpt"
          {...register("excerpt")}
          placeholder="Resumo do artigo para listagem"
          className="min-h-24"
        />
        {errors.excerpt && (
          <p className="text-xs text-red-600">{errors.excerpt.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Conteúdo</Label>
        <Textarea
          id="content"
          {...register("content")}
          placeholder="Conteúdo completo do artigo"
          className="min-h-64"
        />
        {errors.content && (
          <p className="text-xs text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            {...register("published")}
            className="size-4 rounded border-pili-mist accent-pili-steel"
          />
          Publicado
        </label>
      </div>

      <Separator />

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/blog")}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {isEditing ? "Salvar alterações" : "Criar artigo"}
        </Button>
      </div>
    </form>
  );
}
