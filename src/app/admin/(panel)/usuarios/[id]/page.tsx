import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/datetime";
import { Button } from "@/components/ui/button";
import { UserEditForm } from "@/components/admin/user-edit-form";

export const metadata = { title: "Editar usuário" };

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Edição de usuário.
 *
 * A listagem já linkava para `/admin/usuarios/[id]` — rota que não existia e
 * devolvia 404. Como consequência, a action `resetPassword` nunca era chamada
 * de lugar nenhum e, sem fluxo de "esqueci minha senha" no site, não havia
 * forma alguma pela interface de recuperar o acesso de um usuário.
 */
export default async function EditarUsuarioPage({ params }: PageProps) {
  const session = await requireRole("ADMIN");
  const { id } = await params;

  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      company: true,
      phone: true,
      cpfCnpj: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/usuarios">
            <ArrowLeft className="size-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-pili-black">
            {user.name ?? user.email}
          </h1>
          <p className="text-sm text-pili-concrete">
            Criado em {formatDateTime(user.createdAt)} · atualizado em{" "}
            {formatDateTime(user.updatedAt)}
          </p>
        </div>
      </div>

      <UserEditForm
        user={{
          id: user.id,
          name: user.name ?? "",
          email: user.email,
          company: user.company ?? "",
          phone: user.phone ?? "",
          cpfCnpj: user.cpfCnpj ?? "",
          role: user.role,
        }}
        isSelf={session.user.id === user.id}
      />
    </div>
  );
}
