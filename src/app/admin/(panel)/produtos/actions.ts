"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

/** Teto de segurança nas listagens do painel. */
const MAX_LIST = 200;
import { isUniqueConstraintError, logError } from "@/lib/prisma-errors";
import {
  productInputSchema,
  firstIssue,
  formBool,
  formString,
  formJsonArray,
  vazioParaNulo,
} from "@/lib/validators/admin";

/**
 * Grava (ou apaga) a tradução em espanhol de um produto.
 *
 * Nome em branco no painel significa "ainda não traduzido": a linha `es` é
 * removida e o site volta a exibir o português, em vez de mostrar um card com
 * título vazio.
 */
async function salvarTraducaoEs(
  productId: string,
  d: {
    nameEs: string;
    taglineEs: string;
    descriptionEs: string;
    metaTitleEs: string;
    metaDescEs: string;
  },
) {
  const chave = { productId_locale: { productId, locale: "es" as const } };

  if (!d.nameEs.trim() || !d.descriptionEs.trim()) {
    await db.productTranslation.deleteMany({ where: { productId, locale: "es" } });
    return;
  }

  const dados = {
    name: d.nameEs.trim(),
    tagline: vazioParaNulo(d.taglineEs),
    description: d.descriptionEs.trim(),
    metaTitle: vazioParaNulo(d.metaTitleEs),
    metaDesc: vazioParaNulo(d.metaDescEs),
  };

  await db.productTranslation.upsert({
    where: chave,
    update: dados,
    create: { productId, locale: "es", ...dados },
  });
}

/* ---------- helpers ---------- */

/** Extrai e valida o payload do formulário. */
function parseProductForm(data: FormData) {
  const specs = formJsonArray(data, "specs");
  if (specs === null) {
    return { ok: false as const, error: "Formato de especificações inválido" };
  }

  const tagline = formString(data, "tagline").trim();

  const metaTitle = formString(data, "metaTitle").trim();
  const metaDesc = formString(data, "metaDesc").trim();

  const parsed = productInputSchema.safeParse({
    metaTitle: metaTitle || null,
    metaDesc: metaDesc || null,
    slug: formString(data, "slug"),
    category: formString(data, "category"),
    name: formString(data, "name"),
    tagline: tagline || null,
    description: formString(data, "description"),
    active: formBool(data, "active"),
    featured: formBool(data, "featured"),
    specs,
    nameEs: formString(data, "nameEs"),
    taglineEs: formString(data, "taglineEs"),
    descriptionEs: formString(data, "descriptionEs"),
    metaTitleEs: formString(data, "metaTitleEs"),
    metaDescEs: formString(data, "metaDescEs"),
  });

  if (!parsed.success) {
    return { ok: false as const, error: firstIssue(parsed.error) };
  }

  return { ok: true as const, data: parsed.data };
}

/* ---------- leitura ---------- */

export async function getProducts() {
  await requireAdmin();

  try {
    const products = await db.product.findMany({
      include: {
        translations: {
          where: { locale: "pt_BR" },
        },
      },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      take: MAX_LIST,
    });
    return { data: products, error: null };
  } catch (err) {
    logError("PRODUTOS_LIST", err);
    return { data: [], error: "Erro ao carregar produtos" };
  }
}

export async function getProductById(id: string) {
  await requireAdmin();

  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        media: {
          select: { id: true, filename: true, alt: true },
          orderBy: { order: "asc" },
        },
        translations: true,
        specs: { orderBy: { order: "asc" } },
        features: { orderBy: { order: "asc" } },
      },
    });
    return { data: product, error: null };
  } catch (err) {
    logError("PRODUTOS_GET", err);
    return { data: null, error: "Erro ao carregar produto" };
  }
}

/* ---------- escrita ---------- */

export async function createProduct(data: FormData) {
  await requireAdmin();

  const parsed = parseProductForm(data);
  if (!parsed.ok) {
    return { success: false, error: parsed.error };
  }

  const {
    slug,
    category,
    name,
    tagline,
    description,
    active,
    featured,
    specs,
    metaTitle,
    metaDesc,
  } = parsed.data;

  try {
    // `order` nunca era definido: todos os produtos ficavam em 0 e o
    // `orderBy: { order: "asc" }` da listagem devolvia ordem indefinida.
    const last = await db.product.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const product = await db.product.create({
      data: {
        slug,
        category,
        active,
        featured,
        order: (last?.order ?? 0) + 1,
        translations: {
          create: {
            locale: "pt_BR",
            name,
            tagline,
            description,
            metaTitle,
            metaDesc,
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

    await salvarTraducaoEs(product.id, parsed.data);

    revalidatePath("/admin/produtos");
    revalidatePath("/[locale]/(marketing)/produtos", "page");
    revalidatePath("/[locale]/(marketing)/produtos/[slug]", "page");
    revalidatePath("/[locale]/(marketing)", "page");
    return { success: true, id: product.id, error: null };
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return { success: false, error: "Slug já existe" };
    }
    logError("PRODUTOS_CREATE", err);
    return { success: false, error: "Erro ao criar produto" };
  }
}

export async function updateProduct(id: string, data: FormData) {
  await requireAdmin();

  const parsed = parseProductForm(data);
  if (!parsed.ok) {
    return { success: false, error: parsed.error };
  }

  const {
    slug,
    category,
    name,
    tagline,
    description,
    active,
    featured,
    specs,
    metaTitle,
    metaDesc,
  } = parsed.data;

  try {
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
        update: { name, tagline, description, metaTitle, metaDesc },
        create: {
          productId: id,
          locale: "pt_BR",
          name,
          tagline,
          description,
          metaTitle,
          metaDesc,
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
        }),
      ),
    ]);

    await salvarTraducaoEs(id, parsed.data);

    revalidatePath("/admin/produtos");
    revalidatePath("/[locale]/(marketing)/produtos", "page");
    revalidatePath("/[locale]/(marketing)/produtos/[slug]", "page");
    revalidatePath("/[locale]/(marketing)", "page");

    return { success: true, error: null };
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return { success: false, error: "Slug já existe" };
    }
    logError("PRODUTOS_UPDATE", err);
    return { success: false, error: "Erro ao atualizar produto" };
  }
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  try {
    await db.product.delete({ where: { id } });
    revalidatePath("/admin/produtos");
    revalidatePath("/[locale]/(marketing)/produtos", "page");
    revalidatePath("/[locale]/(marketing)/produtos/[slug]", "page");
    revalidatePath("/[locale]/(marketing)", "page");
    return { success: true, error: null };
  } catch (err) {
    logError("PRODUTOS_DELETE", err);
    return { success: false, error: "Erro ao excluir produto" };
  }
}

export async function toggleProductFeatured(id: string) {
  await requireAdmin();

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
    revalidatePath("/[locale]/(marketing)/produtos", "page");
    revalidatePath("/[locale]/(marketing)/produtos/[slug]", "page");
    revalidatePath("/[locale]/(marketing)", "page");
    return { success: true, error: null };
  } catch (err) {
    logError("PRODUTOS_TOGGLE_FEATURED", err);
    return { success: false, error: "Erro ao alterar destaque" };
  }
}
