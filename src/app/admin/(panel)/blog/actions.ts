"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function getPosts() {
  try {
    const posts = await db.post.findMany({
      include: {
        translations: {
          where: { locale: "pt_BR" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { data: posts, error: null };
  } catch {
    return { data: [], error: "Erro ao carregar artigos" };
  }
}

export async function getPostById(id: string) {
  try {
    const post = await db.post.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });
    return { data: post, error: null };
  } catch {
    return { data: null, error: "Erro ao carregar artigo" };
  }
}

export async function createPost(data: FormData) {
  try {
    const slug = data.get("slug") as string;
    const author = (data.get("author") as string) || "PILI Industrial";
    const title = data.get("title") as string;
    const excerpt = data.get("excerpt") as string;
    const content = data.get("content") as string;
    const published = data.get("published") === "true";
    const tagsRaw = data.get("tags") as string;

    const tags = tagsRaw
      ? tagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    if (!slug || !title || !excerpt || !content) {
      return { success: false, error: "Campos obrigatórios não preenchidos" };
    }

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
    const message =
      err instanceof Error && err.message.includes("Unique")
        ? "Slug ja existe"
        : "Erro ao criar artigo";
    return { success: false, error: message };
  }
}

export async function updatePost(id: string, data: FormData) {
  try {
    const slug = data.get("slug") as string;
    const author = (data.get("author") as string) || "PILI Industrial";
    const title = data.get("title") as string;
    const excerpt = data.get("excerpt") as string;
    const content = data.get("content") as string;
    const published = data.get("published") === "true";
    const tagsRaw = data.get("tags") as string;

    const tags = tagsRaw
      ? tagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    if (!slug || !title || !excerpt || !content) {
      return { success: false, error: "Campos obrigatórios não preenchidos" };
    }

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
    const message =
      err instanceof Error && err.message.includes("Unique")
        ? "Slug ja existe"
        : "Erro ao atualizar artigo";
    return { success: false, error: message };
  }
}

export async function deletePost(id: string) {
  try {
    await db.post.delete({ where: { id } });
    revalidatePath("/admin/blog");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Erro ao excluir artigo" };
  }
}

export async function togglePublish(id: string) {
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
  } catch {
    return { success: false, error: "Erro ao alterar publicação" };
  }
}
