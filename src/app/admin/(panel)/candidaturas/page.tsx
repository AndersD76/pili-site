import { Inbox, Paperclip } from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { formatDate } from "@/lib/datetime";
import { formatFileSize } from "@/lib/media";
import { getCandidaturas } from "./actions";
import { CandidaturaActions } from "@/components/admin/candidatura-actions";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/** Rótulo por área; as chaves são as mesmas do formulário público. */
const AREAS: Record<string, string> = {
  engenharia: "Engenharia",
  producao: "Produção",
  comercial: "Comercial",
  administrativo: "Administrativo",
  logistica: "Logística",
  ti: "TI / Tecnologia",
  qualidade: "Qualidade",
  outra: "Outra",
};

export default async function CandidaturasPage() {
  await requireRole("ADMIN", "COMERCIAL");

  const { data: candidaturas, error } = await getCandidaturas();

  const pendentes = candidaturas.filter((c) => !c.reviewedAt).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-pili-black">
          Candidaturas
        </h1>
        <p className="mt-1 text-sm text-pili-concrete">
          Banco de talentos. {candidaturas.length} no total
          {pendentes > 0 && `, ${pendentes} sem análise`}.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {candidaturas.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-pili-mist p-16 text-center">
          <Inbox className="size-10 text-pili-mist" />
          <p className="text-sm text-pili-concrete">
            Nenhuma candidatura recebida ainda. Elas chegam pelo formulário em
            /trabalhe-conosco.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-pili-mist bg-pili-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidato</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Currículo</TableHead>
                <TableHead>Recebida</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidaturas.map((c) => (
                <TableRow key={c.id} className={c.reviewedAt ? "opacity-60" : undefined}>
                  <TableCell>
                    <div className="font-medium text-pili-black">{c.name}</div>
                    {c.message && (
                      <p className="mt-1 max-w-md text-xs leading-relaxed text-pili-concrete">
                        {c.message.length > 160
                          ? `${c.message.slice(0, 160)}…`
                          : c.message}
                      </p>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary">
                      {AREAS[c.area] ?? c.area}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm">
                    <a
                      href={`mailto:${c.email}`}
                      className="text-pili-graphite underline-offset-2 hover:underline"
                    >
                      {c.email}
                    </a>
                    <div className="font-mono text-xs text-pili-concrete">
                      {c.phone}
                    </div>
                  </TableCell>

                  <TableCell className="text-sm">
                    {c.cvFilename ? (
                      <span className="inline-flex items-center gap-1.5 text-pili-concrete">
                        <Paperclip className="size-3.5 shrink-0" />
                        <span className="max-w-40 truncate" title={c.cvFilename}>
                          {c.cvFilename}
                        </span>
                        {c.cvSize != null && (
                          <span className="font-mono text-xs text-pili-cement">
                            {formatFileSize(c.cvSize)}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-xs text-pili-cement">—</span>
                    )}
                  </TableCell>

                  <TableCell className="font-mono text-xs text-pili-concrete">
                    {formatDate(c.createdAt)}
                  </TableCell>

                  <TableCell className="text-right">
                    <CandidaturaActions
                      id={c.id}
                      nome={c.name}
                      temCv={!!c.cvFilename}
                      revisada={!!c.reviewedAt}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
