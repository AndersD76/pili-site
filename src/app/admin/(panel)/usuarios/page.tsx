import Link from "next/link";
import { Plus, Inbox, Pencil } from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { db } from "@/lib/db";
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
import type { Role } from "@prisma/client";

/* ---------- helpers ---------- */

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Admin",
  COMERCIAL: "Comercial",
  TECNICO: "Técnico",
  CLIENTE: "Cliente",
};

const ROLE_COLORS: Record<Role, string> = {
  ADMIN: "bg-red-100 text-red-800 border-red-200",
  COMERCIAL: "bg-blue-100 text-blue-800 border-blue-200",
  TECNICO: "bg-amber-100 text-amber-800 border-amber-200",
  CLIENTE: "bg-green-100 text-green-800 border-green-200",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

/* ---------- page ---------- */

export default async function UsuariosPage() {
  await requireRole("ADMIN");

  // `select` explícito: antes o registro inteiro vinha do banco, incluindo
  // `passwordHash`, só para renderizar cinco colunas.
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      company: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-pili-black">
            Usuários
          </h1>
          <p className="text-sm text-pili-graphite">
            {users.length}{" "}
            {users.length === 1 ? "usuário cadastrado" : "usuários cadastrados"}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/usuarios/novo">
            <Plus className="mr-2 size-4" />
            Novo usuário
          </Link>
        </Button>
      </div>

      {/* Table */}
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-pili-cement py-16 text-center">
          <Inbox className="mb-3 size-10 text-pili-concrete" />
          <p className="text-sm font-medium text-pili-graphite">
            Nenhum usuário cadastrado
          </p>
          <p className="text-xs text-pili-steel">
            Os usuários aparecerão aqui quando forem criados.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="w-[60px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-pili-black">
                    {user.name ?? "-"}
                  </TableCell>
                  <TableCell className="text-pili-graphite">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-pili-graphite">
                    {user.company ?? "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border font-normal ${ROLE_COLORS[user.role]}`}
                    >
                      {ROLE_LABELS[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-pili-steel">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/usuarios/${user.id}`}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Editar</span>
                      </Link>
                    </Button>
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
