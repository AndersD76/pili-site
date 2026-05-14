import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Globe,
  Link as LinkIcon,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  User,
  Briefcase,
  Wheat,
  Truck,
  Tag,
} from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { addNote } from "../actions";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
  ORGANICO: "Organico",
  PAGO: "Pago",
  REFERRAL: "Referral",
  WHATSAPP: "WhatsApp",
  CATALOGO: "Catalogo",
  CALCULADORA: "Calculadora",
  COMPARATIVO: "Comparativo",
  FORMULARIO: "Formulario",
};

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/* ---------- page ---------- */

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: PageProps) {
  await requireRole("ADMIN", "COMERCIAL");

  const { id } = await params;

  let lead;
  try {
    lead = await db.lead.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch {
    lead = null;
  }

  if (!lead) notFound();

  /* --- add note action --- */
  async function handleAddNote(formData: FormData) {
    "use server";
    const content = formData.get("content") as string;
    if (!content?.trim()) return;
    await addNote(id, content.trim());
  }

  const utm = lead.utm as Record<string, string> | null;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1.5 text-sm text-pili-graphite hover:text-pili-black"
      >
        <ArrowLeft className="size-4" />
        Voltar para leads
      </Link>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* Lead info card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl">
                {lead.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow icon={Mail} label="Email" value={lead.email} />
                <InfoRow icon={Phone} label="Telefone" value={lead.phone} />
                {lead.company && (
                  <InfoRow
                    icon={Building2}
                    label="Empresa"
                    value={lead.company}
                  />
                )}
                {lead.cnpj && (
                  <InfoRow icon={Tag} label="CNPJ" value={lead.cnpj} />
                )}
                <InfoRow
                  icon={MapPin}
                  label="Localizacao"
                  value={[lead.city, lead.state, lead.country]
                    .filter(Boolean)
                    .join(", ")}
                />
                {lead.role && (
                  <InfoRow icon={Briefcase} label="Cargo" value={lead.role} />
                )}
                {lead.application && (
                  <InfoRow
                    icon={User}
                    label="Aplicacao"
                    value={lead.application}
                  />
                )}
                {lead.productInterest && (
                  <InfoRow
                    icon={Tag}
                    label="Produto de interesse"
                    value={lead.productInterest}
                  />
                )}
                {lead.grainType && (
                  <InfoRow
                    icon={Wheat}
                    label="Tipo de grao"
                    value={lead.grainType}
                  />
                )}
                {lead.truckVolume && (
                  <InfoRow
                    icon={Truck}
                    label="Volume caminhao"
                    value={`${lead.truckVolume} t`}
                  />
                )}
              </div>

              {lead.message && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-pili-steel">
                      Mensagem
                    </p>
                    <p className="whitespace-pre-wrap text-sm text-pili-graphite">
                      {lead.message}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Notes section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <MessageSquare className="size-5" />
                Notas ({lead.notes.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add note form */}
              <form action={handleAddNote} className="space-y-3">
                <Textarea
                  name="content"
                  placeholder="Adicionar uma nota..."
                  required
                  className="min-h-[80px]"
                />
                <Button type="submit" size="sm">
                  Adicionar nota
                </Button>
              </form>

              {lead.notes.length > 0 && <Separator />}

              {/* Notes timeline */}
              {lead.notes.length === 0 ? (
                <p className="py-4 text-center text-sm text-pili-steel">
                  Nenhuma nota adicionada.
                </p>
              ) : (
                <div className="space-y-4">
                  {lead.notes.map((note) => (
                    <div
                      key={note.id}
                      className="relative border-l-2 border-pili-cement pl-4"
                    >
                      <div className="absolute -left-[5px] top-1.5 size-2 rounded-full bg-pili-cement" />
                      <div className="flex items-center gap-2 text-xs text-pili-steel">
                        <span className="font-mono">{note.authorId}</span>
                        <span>--</span>
                        <time>{formatDateTime(note.createdAt)}</time>
                      </div>
                      <p className="mt-1 text-sm text-pili-graphite">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column - 1/3 */}
        <div className="space-y-6">
          {/* Status card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-pili-steel">
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge
                className={`border text-sm font-normal ${STATUS_COLORS[lead.status]}`}
              >
                {STATUS_LABELS[lead.status]}
              </Badge>
              <div>
                <p className="mb-2 text-xs text-pili-steel">Alterar status</p>
                <LeadStatusSelect
                  leadId={lead.id}
                  currentStatus={lead.status}
                />
              </div>
            </CardContent>
          </Card>

          {/* Source card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-pili-steel">
                Origem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant="outline" className="font-normal">
                {SOURCE_LABELS[lead.source]}
              </Badge>

              {lead.pageUrl && (
                <div className="flex items-start gap-2 text-sm">
                  <LinkIcon className="mt-0.5 size-4 shrink-0 text-pili-steel" />
                  <span className="break-all text-pili-graphite">
                    {lead.pageUrl}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Date card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-pili-steel">
                Datas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-pili-graphite">
                <Calendar className="size-4 text-pili-steel" />
                <span>Criado em {formatDateTime(lead.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-pili-graphite">
                <Calendar className="size-4 text-pili-steel" />
                <span>Atualizado em {formatDateTime(lead.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* UTM card */}
          {utm && Object.keys(utm).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-pili-steel">
                  Dados UTM
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(utm).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2 text-sm">
                      <Globe className="mt-0.5 size-4 shrink-0 text-pili-steel" />
                      <div>
                        <span className="font-mono text-xs text-pili-steel">
                          {key}
                        </span>
                        <p className="text-pili-graphite">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- sub-components ---------- */

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-pili-steel" />
      <div>
        <p className="text-xs text-pili-steel">{label}</p>
        <p className="text-sm text-pili-graphite">{value}</p>
      </div>
    </div>
  );
}
