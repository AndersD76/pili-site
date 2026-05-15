"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import type { LeadStatus, LeadSource, Prisma } from "@prisma/client";

/* ---------- types ---------- */

interface GetLeadsParams {
  status?: string;
  source?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

/* ---------- getLeads ---------- */

export async function getLeads(params: GetLeadsParams) {
  const { status, source, search, page = 1, perPage = 20 } = params;

  const where: Prisma.LeadWhereInput = {};

  if (status) {
    where.status = status as LeadStatus;
  }

  if (source) {
    where.source = source as LeadSource;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [leads, count] = await Promise.all([
      db.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      db.lead.count({ where }),
    ]);

    return { leads, count, totalPages: Math.ceil(count / perPage) };
  } catch {
    return { leads: [], count: 0, totalPages: 0 };
  }
}

/* ---------- updateLeadStatus ---------- */

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  try {
    await db.lead.update({
      where: { id: leadId },
      data: { status },
    });
    revalidatePath("/admin/leads");
    return { success: true };
  } catch {
    throw new Error("Erro ao atualizar status do lead.");
  }
}

/* ---------- addNote ---------- */

export async function addNote(leadId: string, content: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Você precisa estar autenticado para adicionar notas.");
  }

  try {
    await db.note.create({
      data: {
        leadId,
        authorId: session.user.id,
        content,
      },
    });
    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true };
  } catch {
    throw new Error("Erro ao adicionar nota.");
  }
}

/* ---------- deleteLead ---------- */

export async function deleteLead(leadId: string) {
  try {
    await db.lead.delete({ where: { id: leadId } });
    revalidatePath("/admin/leads");
    return { success: true };
  } catch {
    throw new Error("Erro ao excluir lead.");
  }
}

/* ---------- exportLeadsCsv ---------- */

export async function exportLeadsCsv(params: {
  status?: string;
  source?: string;
}) {
  const where: Prisma.LeadWhereInput = {};

  if (params.status) {
    where.status = params.status as LeadStatus;
  }

  if (params.source) {
    where.source = params.source as LeadSource;
  }

  try {
    const leads = await db.lead.findMany({
      where,
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
    ].join(";");

    const rows = leads.map((lead) => {
      const date = new Intl.DateTimeFormat("pt-BR").format(lead.createdAt);
      return [
        lead.id,
        lead.name,
        lead.email,
        lead.phone,
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
        (lead.message ?? "").replace(/[\n\r;]/g, " "),
        lead.source,
        lead.status,
        lead.pageUrl ?? "",
        date,
      ].join(";");
    });

    return [header, ...rows].join("\n");
  } catch {
    throw new Error("Erro ao exportar leads.");
  }
}
