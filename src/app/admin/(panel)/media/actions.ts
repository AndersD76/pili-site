"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRoleOrThrow } from "@/lib/auth-guard";
import { logError } from "@/lib/prisma-errors";
import {
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_LABEL,
  detectImageType,
  isAllowedMimeType,
} from "@/lib/media";

export interface UploadResult {
  success: boolean;
  error?: string;
  media?: { id: string; filename: string; alt: string | null; order: number };
}

/** Vínculo opcional do arquivo com uma entidade do CMS. */
interface UploadTarget {
  productId?: string;
  caseId?: string;
  postId?: string;
}

/**
 * Grava um arquivo enviado pelo painel.
 *
 * A validação é dupla: o `type` declarado pelo navegador **e** a assinatura
 * binária. O primeiro é forjável — renomear um executável para `.jpg` basta —
 * e os bytes vão parar no banco, então não dá para confiar no cliente.
 */
export async function uploadMedia(
  formData: FormData,
  target: UploadTarget = {},
): Promise<UploadResult> {
  await requireRoleOrThrow("ADMIN", "COMERCIAL");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Nenhum arquivo selecionado." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `Arquivo acima de ${MAX_FILE_SIZE_LABEL}. Otimize a imagem antes de enviar.`,
    };
  }

  if (!isAllowedMimeType(file.type)) {
    return {
      success: false,
      error: "Formato não aceito. Use JPG, PNG, WebP ou AVIF.",
    };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  const realType = detectImageType(bytes);
  if (!realType) {
    return {
      success: false,
      error: "O arquivo não é uma imagem válida.",
    };
  }
  if (realType !== file.type) {
    return {
      success: false,
      error: `O conteúdo do arquivo (${realType}) não corresponde à extensão informada.`,
    };
  }

  const alt = (formData.get("alt") as string | null)?.trim() || null;

  try {
    // Nova foto entra no fim da fila da entidade a que pertence.
    const ultima = await db.media.findFirst({
      where: {
        productId: target.productId ?? null,
        caseId: target.caseId ?? null,
        postId: target.postId ?? null,
      },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const media = await db.media.create({
      data: {
        data: Buffer.from(bytes),
        filename: file.name.slice(0, 200),
        mimeType: realType,
        size: file.size,
        alt,
        type: "image",
        order: (ultima?.order ?? -1) + 1,
        productId: target.productId ?? null,
        caseId: target.caseId ?? null,
        postId: target.postId ?? null,
      },
      select: { id: true, filename: true, alt: true, order: true },
    });

    revalidatePath("/admin/media");
    if (target.productId) revalidatePath(`/admin/produtos/${target.productId}`);
    if (target.caseId) revalidatePath(`/admin/obras/${target.caseId}`);
    if (target.postId) revalidatePath(`/admin/blog/${target.postId}`);

    return { success: true, media };
  } catch (err) {
    logError("MEDIA_UPLOAD", err);
    return { success: false, error: "Erro ao salvar o arquivo." };
  }
}

/** Atualiza o texto alternativo — obrigatório para acessibilidade e SEO. */
export async function updateMediaAlt(
  id: string,
  alt: string,
): Promise<{ success: boolean; error?: string }> {
  await requireRoleOrThrow("ADMIN", "COMERCIAL");

  try {
    await db.media.update({
      where: { id },
      data: { alt: alt.trim() || null },
    });
    revalidatePath("/admin/media");
    return { success: true };
  } catch (err) {
    logError("MEDIA_UPDATE_ALT", err);
    return { success: false, error: "Erro ao atualizar a descrição." };
  }
}

export async function deleteMedia(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  await requireRoleOrThrow("ADMIN", "COMERCIAL");

  try {
    await db.media.delete({ where: { id } });
    revalidatePath("/admin/media");
    return { success: true };
  } catch (err) {
    logError("MEDIA_DELETE", err);
    return { success: false, error: "Erro ao excluir o arquivo." };
  }
}

/** Lista sem trazer os binários — a grade usa `/api/media/[id]`. */
export async function listMedia() {
  await requireRoleOrThrow("ADMIN", "COMERCIAL");

  try {
    const items = await db.media.findMany({
      select: {
        id: true,
        filename: true,
        mimeType: true,
        size: true,
        alt: true,
        createdAt: true,
        product: { select: { slug: true } },
        case: { select: { slug: true } },
        post: { select: { slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return { items, error: null };
  } catch (err) {
    logError("MEDIA_LIST", err);
    return { items: [], error: "Erro ao carregar a biblioteca." };
  }
}

/* ---------- ordenação ---------- */

/**
 * Grava a nova ordem das fotos de uma entidade.
 *
 * A primeira posição (`order = 0`) é a imagem principal: é ela que aparece no
 * card da listagem e no cartão de compartilhamento. Uma única transação evita
 * estado intermediário com duas fotos disputando a mesma posição.
 */
export async function reorderMedia(
  ids: string[],
): Promise<{ success: boolean; error?: string }> {
  await requireRoleOrThrow("ADMIN", "COMERCIAL");

  if (ids.length === 0) return { success: true };

  try {
    await db.$transaction(
      ids.map((id, index) =>
        db.media.update({ where: { id }, data: { order: index } }),
      ),
    );

    revalidatePath("/admin/media");
    return { success: true };
  } catch (err) {
    logError("MEDIA_REORDER", err);
    return { success: false, error: "Erro ao reordenar as fotos." };
  }
}
