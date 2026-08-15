"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Locale } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { logError } from "@/lib/prisma-errors";
import { firstIssue } from "@/lib/validators/admin";

/**
 * Edição de um setor.
 *
 * Todos os textos são opcionais: em branco, o site continua usando o rótulo e a
 * descrição das mensagens. Preencher é sobrescrever, não obrigação — por isso
 * não existe criação nem exclusão de setor aqui.
 */
export const setorSchema = z.object({
  tituloPt: z.string().trim().max(60),
  descricaoPt: z.string().trim().max(200),
  // Textos da pagina /solucoes/[setor]; independentes do card da home.
  headlinePt: z.string().trim().max(120),
  descricaoLongaPt: z.string().trim().max(600),
  tituloEs: z.string().trim().max(60),
  descricaoEs: z.string().trim().max(200),
  headlineEs: z.string().trim().max(120),
  descricaoLongaEs: z.string().trim().max(600),
  ordem: z.coerce.number().int().min(0).max(99),
  ativo: z.boolean(),
});

export type SetorInput = z.infer<typeof setorSchema>;

interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Uma tradução só é gravada com título E descrição preenchidos.
 *
 * Meio par produziria um card com título novo e descrição antiga, ou o
 * contrário — mais confuso do que não ter editado.
 */
function traducoes(d: SetorInput) {
  const linhas: {
    locale: Locale;
    titulo: string;
    descricao: string;
    headline: string | null;
    descricaoLonga: string | null;
  }[] = [];

  const nulo = (v: string) => (v.trim() === "" ? null : v.trim());

  if (d.tituloPt !== "" && d.descricaoPt !== "") {
    linhas.push({
      locale: Locale.pt_BR,
      titulo: d.tituloPt,
      descricao: d.descricaoPt,
      headline: nulo(d.headlinePt),
      descricaoLonga: nulo(d.descricaoLongaPt),
    });
  }

  if (d.tituloEs !== "" && d.descricaoEs !== "") {
    linhas.push({
      locale: Locale.es,
      titulo: d.tituloEs,
      descricao: d.descricaoEs,
      headline: nulo(d.headlineEs),
      descricaoLonga: nulo(d.descricaoLongaEs),
    });
  }

  return linhas;
}

export async function atualizarSetor(
  slug: string,
  input: unknown,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = setorSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const d = parsed.data;

  // Título sem descrição (ou o contrário) é engano de preenchimento, não uma
  // escolha: avisa em vez de gravar pela metade.
  const meioPreenchido =
    (d.tituloPt !== "") !== (d.descricaoPt !== "") ||
    (d.tituloEs !== "") !== (d.descricaoEs !== "");
  if (meioPreenchido) {
    return {
      success: false,
      error:
        "Preencha título e descrição juntos, ou deixe os dois em branco para usar o texto padrão.",
    };
  }

  try {
    await db.$transaction([
      db.setor.update({
        where: { slug },
        data: { ordem: d.ordem, ativo: d.ativo },
      }),
      db.setorTranslation.deleteMany({ where: { setorSlug: slug } }),
      db.setorTranslation.createMany({
        data: traducoes(d).map((t) => ({ ...t, setorSlug: slug })),
      }),
    ]);

    // Os cards aparecem na home e a foto também alimenta /solucoes.
    revalidatePath("/", "layout");
    revalidatePath("/admin/setores");
    return { success: true };
  } catch (err) {
    logError("SETOR_UPDATE", err);
    return { success: false, error: "Erro ao salvar o setor." };
  }
}
