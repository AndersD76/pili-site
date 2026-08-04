"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRoleOrThrow } from "@/lib/auth-guard";

/** Teto de segurança nas listagens do painel. */
const MAX_LIST = 200;
import { isUniqueConstraintError, logError } from "@/lib/prisma-errors";
import {
  caseInputSchema,
  firstIssue,
  formBool,
  formString,
  formJsonArray,
} from "@/lib/validators/admin";

/* ---------- helpers ---------- */

/** Extrai e valida o payload do formulário. */
function parseCaseForm(data: FormData) {
  const metrics = formJsonArray(data, "metrics");
  if (metrics === null) {
    return { ok: false as const, error: "Formato de métricas inválido" };
  }

  const rawYear = formString(data, "year").trim();
  const year = rawYear === "" ? NaN : Number(rawYear);

  const parsed = caseInputSchema.safeParse({
    slug: formString(data, "slug"),
    client: formString(data, "client"),
    location: formString(data, "location"),
    year,
    title: formString(data, "title"),
    summary: formString(data, "summary"),
    content: formString(data, "content"),
    active: formBool(data, "active"),
    featured: formBool(data, "featured"),
    metrics,
  });

  if (!parsed.success) {
    return { ok: false as const, error: firstIssue(parsed.error) };
  }

  return { ok: true as const, data: parsed.data };
}

/* ---------- leitura ---------- */

export async function getCases() {
  await requireRoleOrThrow("ADMIN", "COMERCIAL");

  try {
    const cases = await db.case.findMany({
      include: {
        translations: {
          where: { locale: "pt_BR" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: MAX_LIST,
    });
    return { data: cases, error: null };
  } catch (err) {
    logError("OBRAS_LIST", err);
    return { data: [], error: "Erro ao carregar obras" };
  }
}

export async function getCaseById(id: string) {
  await requireRoleOrThrow("ADMIN", "COMERCIAL");

  try {
    const caseItem = await db.case.findUnique({
      where: { id },
      include: {
        media: {
          select: { id: true, filename: true, alt: true },
          orderBy: { order: "asc" },
        },
        translations: true,
        metrics: true,
      },
    });
    return { data: caseItem, error: null };
  } catch (err) {
    logError("OBRAS_GET", err);
    return { data: null, error: "Erro ao carregar obra" };
  }
}

/* ---------- escrita ---------- */

export async function createCase(data: FormData) {
  await requireRoleOrThrow("ADMIN", "COMERCIAL");

  const parsed = parseCaseForm(data);
  if (!parsed.ok) {
    return { success: false, error: parsed.error };
  }

  const {
    slug,
    client,
    location,
    year,
    title,
    summary,
    content,
    active,
    featured,
    metrics,
  } = parsed.data;

  try {
    const caseItem = await db.case.create({
      data: {
        slug,
        client,
        location,
        year,
        active,
        featured,
        translations: {
          create: {
            locale: "pt_BR",
            title,
            summary,
            content,
          },
        },
        metrics: {
          create: metrics.map((m) => ({
            label: m.label,
            value: m.value,
          })),
        },
      },
    });

    revalidatePath("/admin/obras");
    revalidatePath("/[locale]/(marketing)/obras", "page");
    revalidatePath("/[locale]/(marketing)/obras/[slug]", "page");
    return { success: true, id: caseItem.id, error: null };
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return { success: false, error: "Slug já existe" };
    }
    logError("OBRAS_CREATE", err);
    return { success: false, error: "Erro ao criar obra" };
  }
}

export async function updateCase(id: string, data: FormData) {
  await requireRoleOrThrow("ADMIN", "COMERCIAL");

  const parsed = parseCaseForm(data);
  if (!parsed.ok) {
    return { success: false, error: parsed.error };
  }

  const {
    slug,
    client,
    location,
    year,
    title,
    summary,
    content,
    active,
    featured,
    metrics,
  } = parsed.data;

  try {
    await db.$transaction([
      db.case.update({
        where: { id },
        data: {
          slug,
          client,
          location,
          year,
          active,
          featured,
        },
      }),
      db.caseTranslation.upsert({
        where: { caseId_locale: { caseId: id, locale: "pt_BR" } },
        update: { title, summary, content },
        create: {
          caseId: id,
          locale: "pt_BR",
          title,
          summary,
          content,
        },
      }),
      db.caseMetric.deleteMany({ where: { caseId: id } }),
      ...metrics.map((m) =>
        db.caseMetric.create({
          data: {
            caseId: id,
            label: m.label,
            value: m.value,
          },
        }),
      ),
    ]);

    revalidatePath("/admin/obras");
    revalidatePath("/[locale]/(marketing)/obras", "page");
    revalidatePath("/[locale]/(marketing)/obras/[slug]", "page");
    return { success: true, error: null };
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return { success: false, error: "Slug já existe" };
    }
    logError("OBRAS_UPDATE", err);
    return { success: false, error: "Erro ao atualizar obra" };
  }
}

export async function deleteCase(id: string) {
  await requireRoleOrThrow("ADMIN", "COMERCIAL");

  try {
    await db.case.delete({ where: { id } });
    revalidatePath("/admin/obras");
    revalidatePath("/[locale]/(marketing)/obras", "page");
    revalidatePath("/[locale]/(marketing)/obras/[slug]", "page");
    return { success: true, error: null };
  } catch (err) {
    logError("OBRAS_DELETE", err);
    return { success: false, error: "Erro ao excluir obra" };
  }
}
