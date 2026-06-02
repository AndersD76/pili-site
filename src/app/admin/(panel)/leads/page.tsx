import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { getLeads } from "./actions";
import { LeadActionsDropdown } from "@/components/admin/lead-actions-dropdown";
import { ExportLeadsButton } from "@/components/admin/export-leads-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LeadStatus, LeadSource } from "@prisma/client";

/* ---------- helpers ---------- */

const STATUS_LABELS: Record<LeadStatus, string> = {
  NOVO: "Novo",
  QUALIFICADO: "Qualificado",
  CONTATADO: "Contatado",
  PROPOSTA: "Proposta",
  GANHO: "Ganho",
  PERDIDO: "Perdido",
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  NOVO: "bg-blue-100 text-blue-800 border-blue-200",
  QUALIFICADO: "bg-amber-100 text-amber-800 border-amber-200",
  CONTATADO: "bg-purple-100 text-purple-800 border-purple-200",
  PROPOSTA: "bg-cyan-100 text-cyan-800 border-cyan-200",
  GANHO: "bg-green-100 text-green-800 border-green-200",
  PERDIDO: "bg-red-100 text-red-800 border-red-200",
};

const SOURCE_LABELS: Record<LeadSource, string> = {
  ORGANICO: "Orgânico",
  PAGO: "Pago",
  REFERRAL: "Referral",
  WHATSAPP: "WhatsApp",
  CATALOGO: "Catálogo",
  CALCULADORA: "Calculadora",
  COMPARATIVO: "Comparativo",
  FORMULARIO: "Formulário",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

/* ---------- page ---------- */

interface PageProps {
  searchParams: Promise<{
    status?: string;
    source?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function LeadsPage({ searchParams }: PageProps) {
  await requireRole("ADMIN", "COMERCIAL");

  const params = await searchParams;
  const status = params.status ?? undefined;
  const source = params.source ?? undefined;
  const search = params.search ?? undefined;
  const page = Number(params.page ?? "1");

  const { leads, count, totalPages } = await getLeads({
    status,
    source,
    search,
    page,
  });

  const hasFilters = !!(status || source || search);

  /* --- build filter query strings --- */
  function buildUrl(overrides: Record<string, string | undefined>) {
    const base: Record<string, string> = {};
    if (status) base.status = status;
    if (source) base.source = source;
    if (search) base.search = search;

    const merged = { ...base, ...overrides };
    const filtered = Object.entries(merged).filter(
      ([, v]) => v !== undefined && v !== ""
    );
    if (filtered.length === 0) return "/admin/leads";
    return `/admin/leads?${new URLSearchParams(filtered as [string, string][]).toString()}`;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-pili-black">
            Leads
          </h1>
          <p className="text-sm text-pili-graphite">
            {count} {count === 1 ? "lead encontrado" : "leads encontrados"}
          </p>
        </div>
        <ExportLeadsButton status={status} source={source} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect
          paramName="status"
          placeholder="Status"
          current={status}
          options={Object.entries(STATUS_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
          buildUrl={buildUrl}
        />

        <FilterSelect
          paramName="source"
          placeholder="Origem"
          current={source}
          options={Object.entries(SOURCE_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
          buildUrl={buildUrl}
        />

        <form action="/admin/leads" method="get" className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          {source && <input type="hidden" name="source" value={source} />}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-pili-graphite" />
            <Input
              name="search"
              placeholder="Buscar nome, email, empresa..."
              defaultValue={search}
              className="w-[280px] pl-9"
            />
          </div>
          <Button type="submit" variant="outline" size="sm">
            Buscar
          </Button>
        </form>

        {hasFilters && (
          <Link
            href="/admin/leads"
            className="text-sm text-pili-graphite underline underline-offset-4 hover:text-pili-black"
          >
            Limpar filtros
          </Link>
        )}
      </div>

      {/* Table */}
      {leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-pili-cement py-16 text-center">
          <Inbox className="mb-3 size-10 text-pili-cement" />
          <p className="text-sm font-medium text-pili-graphite">
            Nenhum lead encontrado
          </p>
          <p className="text-xs text-pili-steel">
            {hasFilters
              ? "Tente ajustar os filtros para encontrar resultados."
              : "Os leads aparecerao aqui quando forem recebidos."}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="w-[60px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-medium text-pili-black hover:underline"
                    >
                      {lead.name}
                    </Link>
                    <p className="text-xs text-pili-steel">{lead.email}</p>
                  </TableCell>
                  <TableCell className="text-pili-graphite">
                    {lead.company ?? "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {SOURCE_LABELS[lead.source]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border font-normal ${STATUS_COLORS[lead.status]}`}
                    >
                      {STATUS_LABELS[lead.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-pili-steel">
                    {formatDate(lead.createdAt)}
                  </TableCell>
                  <TableCell>
                    <LeadActionsDropdown leadId={lead.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-pili-steel">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={buildUrl({ page: String(page - 1) })}>
                  <ChevronLeft className="mr-1 size-4" />
                  Anterior
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="mr-1 size-4" />
                Anterior
              </Button>
            )}
            {page < totalPages ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={buildUrl({ page: String(page + 1) })}>
                  Próximo
                  <ChevronRight className="ml-1 size-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Próximo
                <ChevronRight className="ml-1 size-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- sub-components ---------- */

function FilterSelect({
  paramName,
  placeholder,
  current,
  options,
  buildUrl,
}: {
  paramName: string;
  placeholder: string;
  current: string | undefined;
  options: { value: string; label: string }[];
  buildUrl: (overrides: Record<string, string | undefined>) => string;
}) {
  return (
    <div className="flex flex-col gap-1">
      {current ? (
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="font-normal">
            {placeholder}:{" "}
            {options.find((o) => o.value === current)?.label ?? current}
          </Badge>
          <Link
            href={buildUrl({ [paramName]: undefined, page: undefined })}
            className="text-xs text-pili-steel hover:text-pili-black"
          >
            x
          </Link>
        </div>
      ) : (
        <FilterSelectDropdown
          paramName={paramName}
          placeholder={placeholder}
          options={options}
          buildUrl={buildUrl}
        />
      )}
    </div>
  );
}

function FilterSelectDropdown({
  paramName,
  placeholder,
  options,
  buildUrl,
}: {
  paramName: string;
  placeholder: string;
  options: { value: string; label: string }[];
  buildUrl: (overrides: Record<string, string | undefined>) => string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {placeholder}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((opt) => (
          <DropdownMenuItem key={opt.value} asChild>
            <Link
              href={buildUrl({ [paramName]: opt.value, page: undefined })}
            >
              {opt.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
