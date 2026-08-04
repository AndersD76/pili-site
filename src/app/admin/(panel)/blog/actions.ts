"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

/** Teto de segurança nas listagens do painel. */
const MAX_LIST = 200;
import { isUniqueConstraintError, logError } from "@/lib/prisma-errors";
import {
  postInputSchema,
  firstIssue,
  formBool,
  formString,
} from "@/lib/validators/admin";

/* ---------- helpers ---------- */

/** Extrai e valida o payload do formulário. */
function parsePostForm(data: FormData) {
  const tags = formString(data, "tags")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const parsed = postInputSchema.safeParse({
    slug: formString(data, "slug"),
    author: formString(data, "author").trim() || "PILI Industrial",
    title: formString(data, "title"),
    excerpt: formString(data, "excerpt"),
    content: formString(data, "content"),
    published: formBool(data, "published"),
    tags,
  });

  if (!parsed.success) {
    return { ok: false as const, error: firstIssue(parsed.error) };
  }

  return { ok: true as const, data: parsed.data };
}

/* ---------- leitura ---------- */

export async function getPosts() {
  await requireAdmin();

  try {
    const posts = await db.post.findMany({
      include: {
        translations: {
          where: { locale: "pt_BR" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: MAX_LIST,
    });
    return { data: posts, error: null };
  } catch (err) {
    logError("BLOG_LIST", err);
    return { data: [], error: "Erro ao carregar artigos" };
  }
}

export async function getPostById(id: string) {
  await requireAdmin();

  try {
    const post = await db.post.findUnique({
      where: { id },
      include: {
        media: {
          select: { id: true, filename: true, alt: true },
          orderBy: { order: "asc" },
        },
        translations: true,
      },
    });
    return { data: post, error: null };
  } catch (err) {
    logError("BLOG_GET", err);
    return { data: null, error: "Erro ao carregar artigo" };
  }
}

/* ---------- escrita ---------- */

export async function createPost(data: FormData) {
  await requireAdmin();

  const parsed = parsePostForm(data);
  if (!parsed.ok) {
    return { success: false, error: parsed.error };
  }

  const { slug, author, title, excerpt, content, published, tags } = parsed.data;

  try {
    const post = await db.post.create({
      data: {
        slug,
        author,
        published,
        publishedAt: published ? new Date() : null,
        tags,
        translations: {
          create: {
            locale: "pt_BR",
            title,
            excerpt,
            content,
          },
        },
      },
    });

    revalidatePath("/admin/blog");
    return { success: true, id: post.id, error: null };
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return { success: false, error: "Slug já existe" };
    }
    logError("BLOG_CREATE", err);
    return { success: false, error: "Erro ao criar artigo" };
  }
}

export async function updatePost(id: string, data: FormData) {
  await requireAdmin();

  const parsed = parsePostForm(data);
  if (!parsed.ok) {
    return { success: false, error: parsed.error };
  }

  const { slug, author, title, excerpt, content, published, tags } = parsed.data;

  try {
    const existing = await db.post.findUnique({
      where: { id },
      select: { published: true, publishedAt: true },
    });

    let publishedAt = existing?.publishedAt ?? null;
    if (published && !existing?.published) {
      publishedAt = new Date();
    } else if (!published) {
      publishedAt = null;
    }

    await db.$transaction([
      db.post.update({
        where: { id },
        data: {
          slug,
          author,
          published,
          publishedAt,
          tags,
        },
      }),
      db.postTranslation.upsert({
        where: { postId_locale: { postId: id, locale: "pt_BR" } },
        update: { title, excerpt, content },
        create: {
          postId: id,
          locale: "pt_BR",
          title,
          excerpt,
          content,
        },
      }),
    ]);

    revalidatePath("/admin/blog");
    return { success: true, error: null };
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return { success: false, error: "Slug já existe" };
    }
    logError("BLOG_UPDATE", err);
    return { success: false, error: "Erro ao atualizar artigo" };
  }
}

export async function deletePost(id: string) {
  await requireAdmin();

  try {
    await db.post.delete({ where: { id } });
    revalidatePath("/admin/blog");
    return { success: true, error: null };
  } catch (err) {
    logError("BLOG_DELETE", err);
    return { success: false, error: "Erro ao excluir artigo" };
  }
}

export async function togglePublish(id: string) {
  await requireAdmin();

  try {
    const post = await db.post.findUnique({
      where: { id },
      select: { published: true },
    });
    if (!post) return { success: false, error: "Artigo não encontrado" };

    const newPublished = !post.published;
    await db.post.update({
      where: { id },
      data: {
        published: newPublished,
        publishedAt: newPublished ? new Date() : null,
      },
    });

    revalidatePath("/admin/blog");
    return { success: true, error: null };
  } catch (err) {
    logError("BLOG_TOGGLE_PUBLISH", err);
    return { success: false, error: "Erro ao alterar publicação" };
  }
}
