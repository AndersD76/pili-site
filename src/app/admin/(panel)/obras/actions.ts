"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function getCases() {
  try {
    const cases = await db.case.findMany({
      include: {
        translations: {
          where: { locale: "pt_BR" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { data: cases, error: null };
  } catch {
    return { data: [], error: "Erro ao carregar obras" };
  }
}

export async function getCaseById(id: string) {
  try {
    const caseItem = await db.case.findUnique({
      where: { id },
      include: {
        translations: true,
        metrics: true,
      },
    });
    return { data: caseItem, error: null };
  } catch {
    return { data: null, error: "Erro ao carregar obra" };
  }
}

export async function createCase(data: FormData) {
  try {
    const slug = data.get("slug") as string;
    const client = data.get("client") as string;
    const location = data.get("location") as string;
    const year = parseInt(data.get("year") as string, 10);
    const title = data.get("title") as string;
    const summary = data.get("summary") as string;
    const content = data.get("content") as string;
    const active = data.get("active") === "true";
    const featured = data.get("featured") === "true";
    const metricsRaw = data.get("metrics") as string;

    let metrics: { label: string; value: string }[] = [];
    if (metricsRaw) {
      try {
        metrics = JSON.parse(metricsRaw);
      } catch {
        return { success: false, error: "Formato de métricas inválido" };
      }
    }

    if (!slug || !client || !location || !year || !title || !summary || !content) {
      return { success: false, error: "Campos obrigatórios não preenchidos" };
    }

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
    return { success: true, id: caseItem.id, error: null };
  } catch (err) {
    const message =
      err instanceof Error && err.message.includes("Unique")
        ? "Slug ja existe"
        : "Erro ao criar obra";
    return { success: false, error: message };
  }
}

export async function updateCase(id: string, data: FormData) {
  try {
    const slug = data.get("slug") as string;
    const client = data.get("client") as string;
    const location = data.get("location") as string;
    const year = parseInt(data.get("year") as string, 10);
    const title = data.get("title") as string;
    const summary = data.get("summary") as string;
    const content = data.get("content") as string;
    const active = data.get("active") === "true";
    const featured = data.get("featured") === "true";
    const metricsRaw = data.get("metrics") as string;

    let metrics: { label: string; value: string }[] = [];
    if (metricsRaw) {
      try {
        metrics = JSON.parse(metricsRaw);
      } catch {
        return { success: false, error: "Formato de métricas inválido" };
      }
    }

    if (!slug || !client || !location || !year || !title || !summary || !content) {
      return { success: false, error: "Campos obrigatórios não preenchidos" };
    }

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
        })
      ),
    ]);

    revalidatePath("/admin/obras");
    return { success: true, error: null };
  } catch (err) {
    const message =
      err instanceof Error && err.message.includes("Unique")
        ? "Slug ja existe"
        : "Erro ao atualizar obra";
    return { success: false, error: message };
  }
}

export async function deleteCase(id: string) {
  try {
    await db.case.delete({ where: { id } });
    revalidatePath("/admin/obras");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Erro ao excluir obra" };
  }
}
