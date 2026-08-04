import Link from "next/link";
import { MediaUploader } from "@/components/admin/media-uploader";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { getPostById } from "../actions";
import { PostForm } from "@/components/admin/post-form";
import { Button } from "@/components/ui/button";

export default async function EditarArtigoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");

  const { id } = await params;
  const { data: post, error } = await getPostById(id);

  if (!post || error) {
    notFound();
  }

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
            Editar artigo
          </h1>
          <p className="text-sm text-pili-concrete">
            Atualize os dados do artigo
          </p>
        </div>
      </div>

      <PostForm post={post} />

      <div className="max-w-2xl rounded-lg border border-pili-mist bg-pili-white p-6">
        <MediaUploader
          postId={post.id}
          initialItems={post.media ?? []}
          label="Imagens do artigo"
          help="A primeira imagem é usada como capa do artigo e no compartilhamento."
        />
      </div>
    </div>
  );
}
