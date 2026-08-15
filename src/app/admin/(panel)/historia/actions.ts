"use server";

import { revalidatePath } from "next/cache";
import { Locale } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { logError } from "@/lib/prisma-errors";
import {
  firstIssue,
  marcoSchema,
  blocoSchema,
  type MarcoInput,
} from "@/lib/validators/admin";

interface ActionResult {
  success: boolean;
  error?: string;
  id?: string;
}

function traducoes(d: MarcoInput) {
  const linhas: { locale: Locale; titulo: string; texto: string }[] = [
    { locale: Locale.pt_BR, titulo: d.tituloPt, texto: d.textoPt },
  ];

  // Espanhol pela metade produziria título novo com texto antigo.
  if (d.tituloEs !== "" && d.textoEs !== "") {
    linhas.push({ locale: Locale.es, titulo: d.tituloEs, texto: d.textoEs });
  }

  return linhas;
}

function revalidar() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/historia");
}

function validarEspanhol(d: MarcoInput): string | null {
  if ((d.tituloEs !== "") !== (d.textoEs !== "")) {
    return "Preencha título e texto em espanhol juntos, ou deixe os dois em branco.";
  }
  return null;
}

export async function criarMarco(input: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = marcoSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: firstIssue(parsed.error) };

  const erro = validarEspanhol(parsed.data);
  if (erro) return { success: false, error: erro };

  try {
    const marco = await db.marcoHistoria.create({
      data: {
        ano: parsed.data.ano === "" ? null : parsed.data.ano,
        ordem: parsed.data.ordem,
        ativo: parsed.data.ativo,
        translations: { create: traducoes(parsed.data) },
      },
    });
    revalidar();
    return { success: true, id: marco.id };
  } catch (err) {
    logError("MARCO_CREATE", err);
    return { success: false, error: "Erro ao criar o marco." };
  }
}

export async function atualizarMarco(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = marcoSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: firstIssue(parsed.error) };

  const erro = validarEspanhol(parsed.data);
  if (erro) return { success: false, error: erro };

  try {
    await db.$transaction([
      db.marcoHistoria.update({
        where: { id },
        data: {
          ano: parsed.data.ano === "" ? null : parsed.data.ano,
          ordem: parsed.data.ordem,
          ativo: parsed.data.ativo,
        },
      }),
      db.marcoHistoriaTranslation.deleteMany({ where: { marcoId: id } }),
      db.marcoHistoriaTranslation.createMany({
        data: traducoes(parsed.data).map((t) => ({ ...t, marcoId: id })),
      }),
    ]);
    revalidar();
    return { success: true, id };
  } catch (err) {
    logError("MARCO_UPDATE", err);
    return { success: false, error: "Erro ao salvar o marco." };
  }
}

export async function excluirMarco(id: string): Promise<ActionResult> {
  await requireAdmin();

  try {
    await db.marcoHistoria.delete({ where: { id } });
    revalidar();
    return { success: true };
  } catch (err) {
    logError("MARCO_DELETE", err);
    return { success: false, error: "Erro ao excluir o marco." };
  }
}

/* ------------------------------------------------ blocos de seção */

function vazioParaNulo(v: string): string | null {
  return v.trim() === "" ? null : v.trim();
}

/**
 * Salva os textos de um bloco de seção.
 *
 * Tudo é opcional: campo vazio devolve o site ao texto das mensagens, o que
 * torna a edição reversível sem precisar lembrar do valor original.
 */
export async function atualizarBloco(
  chave: string,
  input: unknown,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = blocoSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: firstIssue(parsed.error) };

  const d = parsed.data;
  const linhas = [
    {
      locale: Locale.pt_BR,
      titulo: vazioParaNulo(d.tituloPt),
      subtitulo: vazioParaNulo(d.subtituloPt),
      texto: vazioParaNulo(d.textoPt),
    },
    {
      locale: Locale.es,
      titulo: vazioParaNulo(d.tituloEs),
      subtitulo: vazioParaNulo(d.subtituloEs),
      texto: vazioParaNulo(d.textoEs),
    },
  ].filter((l) => l.titulo || l.subtitulo || l.texto);

  try {
    await db.$transaction([
      db.blocoConteudoTranslation.deleteMany({ where: { chave } }),
      db.blocoConteudoTranslation.createMany({
        data: linhas.map((l) => ({ ...l, chave })),
      }),
    ]);
    revalidatePath("/", "layout");
    revalidatePath(`/admin/blocos/${chave}`);
    return { success: true };
  } catch (err) {
    logError("BLOCO_UPDATE", err);
    return { success: false, error: "Erro ao salvar o bloco." };
  }
}
