"use client";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

import { createCase, updateCase } from "@/app/admin/obras/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import type { Case, CaseTranslation, CaseMetric } from "@prisma/client";

type CaseWithRelations = Case & {
  translations: CaseTranslation[];
  metrics: CaseMetric[];
};

const caseSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug obrigatorio")
    .regex(/^[a-z0-9-]+$/, "Apenas letras minusculas, numeros e hifens"),
  client: z.string().min(1, "Cliente obrigatorio"),
  location: z.string().min(1, "Local obrigatorio"),
  year: z
    .number({ coerce: true })
    .int()
    .min(1900, "Ano invalido")
    .max(2100, "Ano invalido"),
  title: z.string().min(1, "Titulo obrigatorio"),
  summary: z.string().min(1, "Resumo obrigatorio"),
  content: z.string().min(1, "Conteudo obrigatorio"),
  active: z.boolean(),
  featured: z.boolean(),
  metrics: z.array(
    z.object({
      label: z.string().min(1, "Campo obrigatorio"),
      value: z.string().min(1, "Campo obrigatorio"),
    })
  ),
});

type CaseFormValues = z.infer<typeof caseSchema>;

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CaseForm({
  caseData,
}: {
  caseData?: CaseWithRelations;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const isEditing = !!caseData;

  const ptTranslation = caseData?.translations.find(
    (t) => t.locale === "pt_BR"
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CaseFormValues>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      slug: caseData?.slug ?? "",
      client: caseData?.client ?? "",
      location: caseData?.location ?? "",
      year: caseData?.year ?? new Date().getFullYear(),
      title: ptTranslation?.title ?? "",
      summary: ptTranslation?.summary ?? "",
      content: ptTranslation?.content ?? "",
      active: caseData?.active ?? true,
      featured: caseData?.featured ?? false,
      metrics:
        caseData?.metrics.map((m) => ({ label: m.label, value: m.value })) ??
        [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "metrics",
  });

  function handleTitleBlur() {
    if (!isEditing) {
      const current = getValues("slug");
      if (!current) {
        setValue("slug", slugify(getValues("title")));
      }
    }
  }

  function onSubmit(values: CaseFormValues) {
    setServerError(null);
    const formData = new FormData();
    formData.set("slug", values.slug);
    formData.set("client", values.client);
    formData.set("location", values.location);
    formData.set("year", String(values.year));
    formData.set("title", values.title);
    formData.set("summary", values.summary);
    formData.set("content", values.content);
    formData.set("active", String(values.active));
    formData.set("featured", String(values.featured));
    formData.set("metrics", JSON.stringify(values.metrics));

    startTransition(async () => {
      const result = isEditing
        ? await updateCase(caseData.id, formData)
        : await createCase(formData);

      if (result.success) {
        router.push("/admin/obras");
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
          <Label htmlFor="title">Titulo</Label>
          <Input
            id="title"
            {...register("title", { onBlur: handleTitleBlur })}
            placeholder="Titulo da obra"
          />
          {errors.title && (
            <p className="text-xs text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} placeholder="titulo-da-obra" />
          {errors.slug && (
            <p className="text-xs text-red-600">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="client">Cliente</Label>
          <Input
            id="client"
            {...register("client")}
            placeholder="Nome do cliente"
          />
          {errors.client && (
            <p className="text-xs text-red-600">{errors.client.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Local</Label>
          <Input
            id="location"
            {...register("location")}
            placeholder="Cidade, Estado"
          />
          {errors.location && (
            <p className="text-xs text-red-600">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Ano</Label>
          <Input
            id="year"
            type="number"
            {...register("year", { valueAsNumber: true })}
            placeholder="2024"
          />
          {errors.year && (
            <p className="text-xs text-red-600">{errors.year.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Resumo</Label>
        <Textarea
          id="summary"
          {...register("summary")}
          placeholder="Breve resumo da obra"
          className="min-h-24"
        />
        {errors.summary && (
          <p className="text-xs text-red-600">{errors.summary.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Conteudo</Label>
        <Textarea
          id="content"
          {...register("content")}
          placeholder="Descricao completa da obra"
          className="min-h-40"
        />
        {errors.content && (
          <p className="text-xs text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            {...register("active")}
            className="size-4 rounded border-pili-mist accent-pili-steel"
          />
          Ativo
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            {...register("featured")}
            className="size-4 rounded border-pili-mist accent-pili-safety"
          />
          Destaque
        </label>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-pili-black">
            Metricas
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ label: "", value: "" })}
          >
            <Plus className="size-4" />
            Adicionar
          </Button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-pili-cement">
            Nenhuma metrica adicionada
          </p>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-3">
            <div className="flex-1 space-y-1">
              <Input
                {...register(`metrics.${index}.label`)}
                placeholder="Metrica (ex: Tempo de instalacao)"
              />
              {errors.metrics?.[index]?.label && (
                <p className="text-xs text-red-600">
                  {errors.metrics[index]?.label?.message}
                </p>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <Input
                {...register(`metrics.${index}.value`)}
                placeholder="Valor (ex: 45 dias)"
              />
              {errors.metrics?.[index]?.value && (
                <p className="text-xs text-red-600">
                  {errors.metrics[index]?.value?.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-red-600 hover:text-red-700"
              onClick={() => remove(index)}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Remover metrica</span>
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/obras")}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {isEditing ? "Salvar alteracoes" : "Criar obra"}
        </Button>
      </div>
    </form>
  );
}
