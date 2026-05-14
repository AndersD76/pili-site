import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { PostForm } from "@/components/admin/post-form";
import { Button } from "@/components/ui/button";

export default async function NovoArtigoPage() {
  await requireRole("ADMIN");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/blog">
            <ArrowLeft className="size-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-pili-black">
            Novo artigo
          </h1>
          <p className="text-sm text-pili-cement">
            Preencha os dados do novo artigo
          </p>
        </div>
      </div>

      <PostForm />
    </div>
  );
}
