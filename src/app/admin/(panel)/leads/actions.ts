"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRoleOrThrow } from "@/lib/auth-guard";
import { logError } from "@/lib/prisma-errors";
import { formatDate } from "@/lib/datetime";
import { LeadStatus, LeadSource, Prisma } from "@prisma/client";

/* ---------- constantes ---------- */

const MAX_PER_PAGE = 100;
const MAX_NOTE_LENGTH = 5000;

/* ---------- types ---------- */

interface GetLeadsParams {
  status?: string;
  source?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

/**
 * Contrato único de retorno das actions de escrita, igual ao dos demais módulos
 * do painel. Antes este arquivo lançava `Error` enquanto produtos, obras, blog e
 * usuários retornavam `{ success, error }` — e os chamadores, escritos para o
 * segundo formato, não tratavam a exceção.
 */
export interface ActionResult {
  success: boolean;
  error?: string;
}

/* ---------- helpers ---------- */

function parseStatus(value?: string): LeadStatus | undefined {
  return value && value in LeadStatus ? (value as LeadStatus) : undefined;
}

function parseSource(value?: string): LeadSource | undefined {
  return value && value in LeadSource ? (value as LeadSource) : undefined;
}

function buildWhere(params: {
  status?: string;
  source?: string;
  search?: string;
  ids?: string[];
}): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = { deletedAt: null };

  const status = parseStatus(params.status);
  if (status) where.status = status;

  const source = parseSource(params.source);
  if (source) where.source = source;

  // A busca textual é resolvida antes, via SQL com `unaccent` (ver
  // `searchLeadIds`); aqui só restringimos ao conjunto encontrado.
  if (params.ids) where.id = { in: params.ids };

  return where;
}

/**
 * IDs de leads que casam com o termo, ignorando acentos e caixa.
 *
 * O `contains` do Prisma com `mode: "insensitive"` cobre apenas caixa: buscar
 * "Joao" não encontrava "João". A extensão `unaccent` (migration
 * `20260731140000`) normaliza os dois lados da comparação, e os índices trigram
 * mantêm a consulta indexada.
 */
async function searchLeadIds(term: string): Promise<string[]> {
  const like = `%${term.trim()}%`;

  const rows = await db.$queryRaw<{ id: string }[]>`
    SELECT "id" FROM "Lead"
    WHERE "deletedAt" IS NULL
      AND (
        lower(pili_unaccent("name"))                  LIKE lower(pili_unaccent(${like}))
        OR lower(pili_unaccent("email"))              LIKE lower(pili_unaccent(${like}))
        OR lower(pili_unaccent(coalesce("company",''))) LIKE lower(pili_unaccent(${like}))
      )
    LIMIT 5000
  `;

  return rows.map((r) => r.id);
}

/**
 * Escapa um campo para CSV: aspas duplas ao redor (protege `;` e quebras de
 * linha) e apóstrofo à frente de caracteres que o Excel/Sheets interpretariam
 * como fórmula — os campos vêm do formulário público.
 */
function csvCell(value: unknown): string {
  const raw = value === null || value === undefined ? "" : String(value);
  const safe = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
}

/* ---------- getLeads ---------- */

export async function getLeads(params: GetLeadsParams) {
  await requireRoleOrThrow("ADMIN", "COMERCIAL");

  const { page = 1, perPage = 20 } = params;

  const safePerPage = Number.isFinite(perPage)
    ? Math.min(MAX_PER_PAGE, Math.max(1, Math.floor(perPage)))
    : 20;
  const requestedPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;

  try {
    const ids = params.search ? await searchLeadIds(params.search) : undefined;

    // Termo sem nenhum resultado: evita montar `id IN ()`.
    if (ids && ids.length === 0) {
      return { leads: [], count: 0, totalPages: 1, currentPage: 1 };
    }

    const where = buildWhere({ ...params, ids });
    const count = await db.lead.count({ where });
    const totalPages = Math.max(1, Math.ceil(count / safePerPage));

    // Devolve a página efetivamente usada para a UI não exibir "Página NaN de 3"
    // nem prender o usuário fora do intervalo.
    const currentPage = Math.min(requestedPage, totalPages);

    const leads = await db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * safePerPage,
      take: safePerPage,
    });

    return { leads, count, totalPages, currentPage };
  } catch (err) {
    logError("LEADS_LIST", err);
    return { leads: [], count: 0, totalPages: 1, currentPage: 1 };
  }
}

/* ---------- updateLeadStatus ---------- */

export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus,
): Promise<ActionResult> {
  await requireRoleOrThrow("ADMIN", "COMERCIAL");

  if (!(status in LeadStatus)) {
    return { success: false, error: "Status inválido." };
  }

  try {
    await db.lead.update({ where: { id: leadId }, data: { status } });
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (err) {
    logError("LEADS_UPDATE_STATUS", err);
    return { success: false, error: "Erro ao atualizar status do lead." };
  }
}

/* ---------- addNote ---------- */

export async function addNote(
  leadId: string,
  content: string,
): Promise<ActionResult> {
  const session = await requireRoleOrThrow("ADMIN", "COMERCIAL");

  const trimmed = content.trim();
  if (!trimmed) {
    return { success: false, error: "A nota não pode estar vazia." };
  }
  if (trimmed.length > MAX_NOTE_LENGTH) {
    return { success: false, error: "A nota excede o tamanho máximo." };
  }

  try {
    await db.note.create({
      data: { leadId, authorId: session.user.id, content: trimmed },
    });
    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true };
  } catch (err) {
    logError("LEADS_ADD_NOTE", err);
    return { success: false, error: "Erro ao adicionar nota." };
  }
}

/* ---------- deleteLead ---------- */

/** Soft delete — leads são dado comercial e de origem externa, não se apagam. */
export async function deleteLead(leadId: string): Promise<ActionResult> {
  await requireRoleOrThrow("ADMIN", "COMERCIAL");

  try {
    await db.lead.update({
      where: { id: leadId },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    logError("LEADS_DELETE", err);
    return { success: false, error: "Erro ao excluir lead." };
  }
}

/* ---------- exportLeadsCsv ---------- */

export async function exportLeadsCsv(params: {
  status?: string;
  source?: string;
}): Promise<{ success: boolean; csv?: string; error?: string }> {
  await requireRoleOrThrow("ADMIN", "COMERCIAL");

  try {
    const leads = await db.lead.findMany({
      where: buildWhere(params),
      orderBy: { createdAt: "desc" },
    });

    const header = [
      "ID",
      "Nome",
      "Email",
      "Telefone",
      "Empresa",
      "CNPJ",
      "País",
      "Estado",
      "Cidade",
      "Cargo",
      "Aplicação",
      "Produto de interesse",
      "Tipo de grão",
      "Volume caminhão",
      "Mensagem",
      "Origem",
      "Status",
      "Página",
      "Criado em",
    ]
      .map(csvCell)
      .join(";");

    const rows = leads.map((lead) =>
      [
        lead.id,
        lead.name,
        lead.email,
        lead.phone ?? "",
        lead.company ?? "",
        lead.cnpj ?? "",
        lead.country,
        lead.state ?? "",
        lead.city ?? "",
        lead.role ?? "",
        lead.application ?? "",
        lead.productInterest ?? "",
        lead.grainType ?? "",
        lead.truckVolume ?? "",
        lead.message ?? "",
        lead.source,
        lead.status,
        lead.pageUrl ?? "",
        formatDate(lead.createdAt),
      ]
        .map(csvCell)
        .join(";"),
    );

    // BOM para o Excel pt-BR reconhecer UTF-8 nos acentos.
    return { success: true, csv: "﻿" + [header, ...rows].join("\r\n") };
  } catch (err) {
    logError("LEADS_EXPORT", err);
    return { success: false, error: "Erro ao exportar leads." };
  }
}

/* ---------- anonymizeLead ---------- */

/**
 * Anonimiza os dados pessoais de um lead, preservando as métricas agregadas.
 *
 * Atende ao direito de eliminação do titular (LGPD, Art. 18, VI). O soft delete
 * de `deleteLead` tira o lead da listagem mas **mantém nome, e-mail, telefone,
 * empresa e mensagem no banco indefinidamente** — atender um pedido de exclusão
 * por ali não elimina dado nenhum.
 *
 * O que fica: origem, status, datas e volume — suficientes para os relatórios
 * de funil, sem identificar ninguém. O que sai: tudo que é dado pessoal.
 */
export async function anonymizeLead(leadId: string): Promise<ActionResult> {
  await requireRoleOrThrow("ADMIN");

  try {
    await db.$transaction([
      db.note.deleteMany({ where: { leadId } }),
      db.lead.update({
        where: { id: leadId },
        data: {
          name: "[anonimizado]",
          email: `anon-${leadId}@anonimizado.invalid`,
          phone: null,
          company: null,
          cnpj: null,
          state: null,
          city: null,
          role: null,
          message: null,
          pageUrl: null,
          utm: Prisma.DbNull,
          anonymizedAt: new Date(),
          deletedAt: new Date(),
        },
      }),
    ]);

    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    logError("LEADS_ANONYMIZE", err);
    return { success: false, error: "Erro ao anonimizar o lead." };
  }
}
