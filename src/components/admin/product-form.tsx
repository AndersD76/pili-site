"use client";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

import { createProduct, updateProduct } from "@/app/admin/produtos/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import type {
  Product,
  ProductTranslation,
  Spec,
  Feature,
  ProductCategory,
} from "@prisma/client";

type ProductWithRelations = Product & {
  translations: ProductTranslation[];
  specs: Spec[];
  features: Feature[];
};

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: "TOMBADOR_FIXO", label: "Tombador fixo" },
  { value: "TOMBADOR_MOVEL", label: "Tombador móvel" },
  { value: "COLETOR_AMOSTRAS", label: "Coletor de amostras" },
  { value: "UNIDADE_TRANSBORDO", label: "Unidade de transbordo" },
  { value: "ESPECIAL", label: "Especial" },
];

const productSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug obrigatório")
    .regex(/^[a-z0-9-]+$/, "Apenas letras minusculas, numeros e hifens"),
  category: z.enum([
    "TOMBADOR_FIXO",
    "TOMBADOR_MOVEL",
    "COLETOR_AMOSTRAS",
    "UNIDADE_TRANSBORDO",
    "ESPECIAL",
  ]),
  name: z.string().min(1, "Nome obrigatório"),
  tagline: z.string().optional(),
  description: z.string().min(1, "Descrição obrigatória"),
  active: z.boolean(),
  featured: z.boolean(),
  specs: z.array(
    z.object({
      key: z.string().min(1, "Campo obrigatório"),
      value: z.string().min(1, "Campo obrigatório"),
    })
  ),
});

type ProductFormValues = z.infer<typeof productSchema>;

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({
  product,
}: {
  product?: ProductWithRelations;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const isEditing = !!product;

  const ptTranslation = product?.translations.find(
    (t) => t.locale === "pt_BR"
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      slug: product?.slug ?? "",
      category: product?.category ?? "TOMBADOR_FIXO",
      name: ptTranslation?.name ?? "",
      tagline: ptTranslation?.tagline ?? "",
      description: ptTranslation?.description ?? "",
      active: product?.active ?? true,
      featured: product?.featured ?? false,
      specs:
        product?.specs.map((s) => ({ key: s.key, value: s.value })) ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specs",
  });

  function handleNameBlur() {
    if (!isEditing) {
      const current = getValues("slug");
      if (!current) {
        setValue("slug", slugify(getValues("name")));
      }
    }
  }

  function onSubmit(values: ProductFormValues) {
    setServerError(null);
    const formData = new FormData();
    formData.set("slug", values.slug);
    formData.set("category", values.category);
    formData.set("name", values.name);
    formData.set("tagline", values.tagline ?? "");
    formData.set("description", values.description);
    formData.set("featured", String(values.featured));
    formData.set("active", String(values.active));
    formData.set("specs", JSON.stringify(values.specs));

    startTransition(async () => {
      const result = isEditing
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);

      if (result.success) {
        router.push("/admin/produtos");
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
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            {...register("name", { onBlur: handleNameBlur })}
            placeholder="Tombador fixo TF-200"
          />
          {errors.name && (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} placeholder="tombador-fixo-tf-200" />
          {errors.slug && (
            <p className="text-xs text-red-600">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select
            defaultValue={product?.category ?? "TOMBADOR_FIXO"}
            onValueChange={(val) =>
              setValue("category", val as ProductFormValues["category"])
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-xs text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            {...register("tagline")}
            placeholder="Breve descrição do produto"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Descrição completa do produto"
          className="min-h-32"
        />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description.message}</p>
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
            Especificações
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ key: "", value: "" })}
          >
            <Plus className="size-4" />
            Adicionar
          </Button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-pili-cement">
            Nenhuma especificação adicionada
          </p>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-3">
            <div className="flex-1 space-y-1">
              <Input
                {...register(`specs.${index}.key`)}
                placeholder="Propriedade (ex: Capacidade)"
              />
              {errors.specs?.[index]?.key && (
                <p className="text-xs text-red-600">
                  {errors.specs[index]?.key?.message}
                </p>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <Input
                {...register(`specs.${index}.value`)}
                placeholder="Valor (ex: 200 t/h)"
              />
              {errors.specs?.[index]?.value && (
                <p className="text-xs text-red-600">
                  {errors.specs[index]?.value?.message}
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
              <span className="sr-only">Remover especificação</span>
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/produtos")}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {isEditing ? "Salvar alterações" : "Criar produto"}
        </Button>
      </div>
    </form>
  );
}
