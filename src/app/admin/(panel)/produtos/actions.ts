"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { ProductCategory } from "@prisma/client";

export async function getProducts() {
  try {
    const products = await db.product.findMany({
      include: {
        translations: {
          where: { locale: "pt_BR" },
        },
      },
      orderBy: { order: "asc" },
    });
    return { data: products, error: null };
  } catch {
    return { data: [], error: "Erro ao carregar produtos" };
  }
}

export async function getProductById(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        translations: true,
        specs: { orderBy: { order: "asc" } },
        features: { orderBy: { order: "asc" } },
      },
    });
    return { data: product, error: null };
  } catch {
    return { data: null, error: "Erro ao carregar produto" };
  }
}

export async function createProduct(data: FormData) {
  try {
    const slug = data.get("slug") as string;
    const category = data.get("category") as ProductCategory;
    const name = data.get("name") as string;
    const tagline = (data.get("tagline") as string) || null;
    const description = data.get("description") as string;
    const featured = data.get("featured") === "true";
    const active = data.get("active") === "true";
    const specsRaw = data.get("specs") as string;

    let specs: { key: string; value: string }[] = [];
    if (specsRaw) {
      try {
        specs = JSON.parse(specsRaw);
      } catch {
        return { success: false, error: "Formato de especificações inválido" };
      }
    }

    if (!slug || !category || !name || !description) {
      return { success: false, error: "Campos obrigatórios não preenchidos" };
    }

    const product = await db.product.create({
      data: {
        slug,
        category,
        active,
        featured,
        translations: {
          create: {
            locale: "pt_BR",
            name,
            tagline,
            description,
          },
        },
        specs: {
          create: specs.map((s, i) => ({
            key: s.key,
            value: s.value,
            order: i,
          })),
        },
      },
    });

    revalidatePath("/admin/produtos");
    return { success: true, id: product.id, error: null };
  } catch (err) {
    const message =
      err instanceof Error && err.message.includes("Unique")
        ? "Slug ja existe"
        : "Erro ao criar produto";
    return { success: false, error: message };
  }
}

export async function updateProduct(id: string, data: FormData) {
  try {
    const slug = data.get("slug") as string;
    const category = data.get("category") as ProductCategory;
    const name = data.get("name") as string;
    const tagline = (data.get("tagline") as string) || null;
    const description = data.get("description") as string;
    const featured = data.get("featured") === "true";
    const active = data.get("active") === "true";
    const specsRaw = data.get("specs") as string;

    let specs: { key: string; value: string }[] = [];
    if (specsRaw) {
      try {
        specs = JSON.parse(specsRaw);
      } catch {
        return { success: false, error: "Formato de especificações inválido" };
      }
    }

    if (!slug || !category || !name || !description) {
      return { success: false, error: "Campos obrigatórios não preenchidos" };
    }

    await db.$transaction([
      db.product.update({
        where: { id },
        data: {
          slug,
          category,
          active,
          featured,
        },
      }),
      db.productTranslation.upsert({
        where: { productId_locale: { productId: id, locale: "pt_BR" } },
        update: { name, tagline, description },
        create: {
          productId: id,
          locale: "pt_BR",
          name,
          tagline,
          description,
        },
      }),
      db.spec.deleteMany({ where: { productId: id } }),
      ...specs.map((s, i) =>
        db.spec.create({
          data: {
            productId: id,
            key: s.key,
            value: s.value,
            order: i,
          },
        })
      ),
    ]);

    revalidatePath("/admin/produtos");
    return { success: true, error: null };
  } catch (err) {
    const message =
      err instanceof Error && err.message.includes("Unique")
        ? "Slug ja existe"
        : "Erro ao atualizar produto";
    return { success: false, error: message };
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.product.delete({ where: { id } });
    revalidatePath("/admin/produtos");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Erro ao excluir produto" };
  }
}

export async function toggleProductFeatured(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      select: { featured: true },
    });
    if (!product) return { success: false, error: "Produto não encontrado" };

    await db.product.update({
      where: { id },
      data: { featured: !product.featured },
    });

    revalidatePath("/admin/produtos");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Erro ao alterar destaque" };
  }
}
