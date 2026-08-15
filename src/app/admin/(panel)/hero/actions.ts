"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Locale } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { logError } from "@/lib/prisma-errors";
import { firstIssue } from "@/lib/validators/admin";

/**
 * Slide do carrossel.
 *
 * O título em português é obrigatório porque é o fallback de todos os idiomas:
 * sem ele um slide sem tradução em espanhol simplesmente sumiria do carrossel.
 * O espanhol é opcional e cai para o português quando vazio.
 */
export const heroSlideSchema = z.object({
  tituloPt: z.string().trim().min(1, "Título em português obrigatório").max(120),
  subtituloPt: z.string().trim().max(240),
  tituloEs: z.string().trim().max(120),
  subtituloEs: z.string().trim().max(240),
  ordem: z.coerce.number().int().min(0).max(999),
  ativo: z.boolean(),
});

export type HeroSlideInput = z.infer<typeof heroSlideSchema>;

interface ActionResult {
  success: boolean;
  error?: string;
  id?: string;
}

function vazioParaNulo(value: string): string | null {
  return value.trim() === "" ? null : value.trim();
}

/** O hero é a primeira coisa da home; a mudança precisa aparecer em todo lugar. */
function revalidarTudo() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/hero");
}

/** Traduções do slide: espanhol só é gravado se tiver título preenchido. */
function traducoes(d: HeroSlideInput) {
  // Anotado: sem isso o TypeScript infere o tipo do primeiro item e recusa o
  // `es` do push.
  const linhas: {
    locale: Locale;
    titulo: string;
    subtitulo: string | null;
  }[] = [
    {
      locale: Locale.pt_BR,
      titulo: d.tituloPt,
      subtitulo: vazioParaNulo(d.subtituloPt),
    },
  ];

  if (d.tituloEs.trim() !== "") {
    linhas.push({
      locale: Locale.es,
      titulo: d.tituloEs,
      subtitulo: vazioParaNulo(d.subtituloEs),
    });
  }

  return linhas;
}

export async function criarHeroSlide(input: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = heroSlideSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  try {
    const slide = await db.heroSlide.create({
      data: {
        ordem: parsed.data.ordem,
        ativo: parsed.data.ativo,
        translations: { create: traducoes(parsed.data) },
      },
    });

    revalidarTudo();
    // O id volta para a tela levar direto ao envio da imagem: um slide sem
    // foto não aparece no site.
    return { success: true, id: slide.id };
  } catch (err) {
    logError("HERO_SLIDE_CREATE", err);
    return { success: false, error: "Erro ao criar o slide." };
  }
}

export async function atualizarHeroSlide(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = heroSlideSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  try {
    await db.$transaction([
      db.heroSlide.update({
        where: { id },
        data: { ordem: parsed.data.ordem, ativo: parsed.data.ativo },
      }),
      // Recriar é mais simples que casar locale a locale, e é o que o seed de
      // posts já faz. Apagar o espanhol quando o campo é esvaziado sai de graça.
      db.heroSlideTranslation.deleteMany({ where: { slideId: id } }),
      db.heroSlideTranslation.createMany({
        data: traducoes(parsed.data).map((t) => ({ ...t, slideId: id })),
      }),
    ]);

    revalidarTudo();
    return { success: true, id };
  } catch (err) {
    logError("HERO_SLIDE_UPDATE", err);
    return { success: false, error: "Erro ao salvar o slide." };
  }
}

export async function excluirHeroSlide(id: string): Promise<ActionResult> {
  await requireAdmin();

  try {
    // As traduções e a mídia caem por cascade.
    await db.heroSlide.delete({ where: { id } });
    revalidarTudo();
    return { success: true };
  } catch (err) {
    logError("HERO_SLIDE_DELETE", err);
    return { success: false, error: "Erro ao excluir o slide." };
  }
}
