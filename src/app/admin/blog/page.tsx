import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { getPosts, deletePost, togglePublish } from "./actions";
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

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default async function BlogPage() {
  await requireRole("ADMIN");

  const { data: posts, error } = await getPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-pili-black">
            Blog
          </h1>
          <p className="text-sm text-pili-cement">
            Gerencie os artigos do blog
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/novo">
            <Plus className="size-4" />
            Novo artigo
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
              <TableHead>Titulo</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Publicado</TableHead>
              <TableHead>Data publicacao</TableHead>
              <TableHead className="text-right">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 && !error && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-pili-cement"
                >
                  Nenhum artigo cadastrado
                </TableCell>
              </TableRow>
            )}
            {posts.map((post) => {
              const translation = post.translations[0];
              return (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    {translation?.title ?? post.slug}
                  </TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>
                    <form
                      action={async () => {
                        "use server";
                        await togglePublish(post.id);
                      }}
                    >
                      <Button
                        type="submit"
                        variant="ghost"
                        size="xs"
                        className="p-0"
                      >
                        <Badge
                          variant={post.published ? "default" : "outline"}
                        >
                          {post.published ? "Publicado" : "Rascunho"}
                        </Badge>
                      </Button>
                    </form>
                  </TableCell>
                  <TableCell>
                    {post.publishedAt
                      ? dateFormatter.format(new Date(post.publishedAt))
                      : "--"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-xs" asChild>
                        <Link href={`/admin/blog/${post.id}`}>
                          <Pencil className="size-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                      <form
                        action={async () => {
                          "use server";
                          await deletePost(post.id);
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
