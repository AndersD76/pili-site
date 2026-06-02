import Link from "next/link";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { getCases, deleteCase } from "./actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ObrasPage() {
  await requireRole("ADMIN", "COMERCIAL");

  const { data: cases, error } = await getCases();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-pili-black">
            Obras / Casos
          </h1>
          <p className="text-sm text-pili-cement">
            Gerencie os casos e obras realizadas
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/obras/novo">
            <Plus className="size-4" />
            Nova obra
          </Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-pili-mist bg-pili-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead>Destaque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.length === 0 && !error && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-pili-cement"
                >
                  Nenhuma obra cadastrada
                </TableCell>
              </TableRow>
            )}
            {cases.map((caseItem) => {
              const translation = caseItem.translations[0];
              return (
                <TableRow key={caseItem.id}>
                  <TableCell className="font-medium">
                    {translation?.title ?? caseItem.slug}
                  </TableCell>
                  <TableCell>{caseItem.client}</TableCell>
                  <TableCell>{caseItem.location}</TableCell>
                  <TableCell>{caseItem.year}</TableCell>
                  <TableCell>
                    <Badge
                      variant={caseItem.active ? "default" : "outline"}
                    >
                      {caseItem.active ? "Sim" : "Não"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Star
                      className={
                        caseItem.featured
                          ? "size-4 fill-pili-safety text-pili-safety"
                          : "size-4 text-pili-cement"
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-xs" asChild>
                        <Link href={`/admin/obras/${caseItem.id}`}>
                          <Pencil className="size-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                      <form
                        action={async () => {
                          "use server";
                          await deleteCase(caseItem.id);
                        }}
                      >
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon-xs"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="size-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
