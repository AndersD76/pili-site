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
  heroSlideId?: string;
  setorSlug?: string;
  blocoChave?: string;
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
        heroSlideId: target.heroSlideId ?? null,
        setorSlug: target.setorSlug ?? null,
        blocoChave: target.blocoChave ?? null,
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
        heroSlideId: target.heroSlideId ?? null,
        setorSlug: target.setorSlug ?? null,
        blocoChave: target.blocoChave ?? null,
      },
      select: { id: true, filename: true, alt: true, order: true },
    });

    revalidatePath("/admin/media");
    if (target.productId) revalidatePath(`/admin/produtos/${target.productId}`);
    if (target.caseId) revalidatePath(`/admin/obras/${target.caseId}`);
    if (target.postId) revalidatePath(`/admin/blog/${target.postId}`);
    if (target.heroSlideId) revalidatePath(`/admin/hero/${target.heroSlideId}`);
    if (target.setorSlug) revalidatePath(`/admin/setores/${target.setorSlug}`);
    if (target.blocoChave) revalidatePath(`/admin/blocos/${target.blocoChave}`);

    return { success: true, media };
  } catch (err) {
    logError("MEDIA_UPLOAD", err);
    return { success: false, error: "Erro ao salvar o arquivo." };
  }
}

/**
 * Invalida tudo que mostra esta foto.
 *
 * Só `uploadMedia` fazia isso. Excluir e reordenar invalidavam apenas
 * `/admin/media`, então a tela de edição do produto/obra/artigo continuava
 * servindo a lista antiga do cache — a foto sumia da tela e reaparecia ao
 * voltar para a página. E o site público seguia exibindo a foto excluída até a
 * revalidação por tempo.
 */
function invalidarPaginas(alvo: {
  productId?: string | null;
  caseId?: string | null;
  postId?: string | null;
  heroSlideId?: string | null;
  setorSlug?: string | null;
  blocoChave?: string | null;
}) {
  revalidatePath("/admin/media");

  if (alvo.productId) {
    revalidatePath(`/admin/produtos/${alvo.productId}`);
    revalidatePath("/[locale]/(marketing)/produtos", "page");
    revalidatePath("/[locale]/(marketing)/produtos/[slug]", "page");
  }
  if (alvo.caseId) {
    revalidatePath(`/admin/obras/${alvo.caseId}`);
    revalidatePath("/[locale]/(marketing)/obras", "page");
    revalidatePath("/[locale]/(marketing)/obras/[slug]", "page");
  }
  if (alvo.postId) {
    revalidatePath(`/admin/blog/${alvo.postId}`);
    revalidatePath("/[locale]/(marketing)/blog", "page");
    revalidatePath("/[locale]/(marketing)/blog/[slug]", "page");
  }
  // O carrossel do hero: a home ja e revalidada logo abaixo, aqui basta a
  // tela de edicao do slide.
  if (alvo.heroSlideId) {
    revalidatePath(`/admin/hero/${alvo.heroSlideId}`);
  }
  // O card do setor esta na home, revalidada logo abaixo; e a foto tambem
  // alimenta a pagina do setor.
  if (alvo.setorSlug) {
    revalidatePath(`/admin/setores/${alvo.setorSlug}`);
    revalidatePath("/[locale]/(marketing)/solucoes/[setor]", "page");
  }
  if (alvo.blocoChave) {
    revalidatePath(`/admin/blocos/${alvo.blocoChave}`);
  }
  revalidatePath("/[locale]/(marketing)", "page");
}

/** Atualiza o texto alternativo — obrigatório para acessibilidade e SEO. */
export async function updateMediaAlt(
  id: string,
  alt: string,
): Promise<{ success: boolean; error?: string }> {
  await requireRoleOrThrow("ADMIN", "COMERCIAL");

  try {
    const media = await db.media.update({
      where: { id },
      data: { alt: alt.trim() || null },
      select: {
        productId: true,
        caseId: true,
        postId: true,
        heroSlideId: true,
        setorSlug: true,
        blocoChave: true,
      },
    });
    invalidarPaginas(media);
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
    // O vínculo precisa ser lido antes: depois do delete não há mais de onde
    // descobrir quais páginas invalidar.
    const media = await db.media.findUnique({
      where: { id },
      select: {
        productId: true,
        caseId: true,
        postId: true,
        heroSlideId: true,
        setorSlug: true,
        blocoChave: true,
      },
    });

    if (!media) {
      return { success: false, error: "Foto não encontrada." };
    }

    await db.media.delete({ where: { id } });
    invalidarPaginas(media);
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

    // A ordem define qual foto é a principal — o site inteiro precisa saber.
    const dono = await db.media.findUnique({
      where: { id: ids[0] },
      select: {
        productId: true,
        caseId: true,
        postId: true,
        heroSlideId: true,
        setorSlug: true,
        blocoChave: true,
      },
    });
    if (dono) invalidarPaginas(dono);

    return { success: true };
  } catch (err) {
    logError("MEDIA_REORDER", err);
    return { success: false, error: "Erro ao reordenar as fotos." };
  }
}
