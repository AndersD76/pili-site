import Link from "next/link";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { getProducts, deleteProduct, toggleProductFeatured } from "./actions";
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

const CATEGORY_LABELS: Record<string, string> = {
  TOMBADOR_FIXO: "Tombador fixo",
  TOMBADOR_MOVEL: "Tombador movel",
  COLETOR_AMOSTRAS: "Coletor de amostras",
  UNIDADE_TRANSBORDO: "Unidade de transbordo",
  ESPECIAL: "Especial",
};

export default async function ProdutosPage() {
  await requireRole("ADMIN");

  const { data: products, error } = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-pili-black">
            Produtos
          </h1>
          <p className="text-sm text-pili-cement">
            Gerencie o catalogo de produtos
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/produtos/novo">
            <Plus className="size-4" />
            Novo produto
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
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead>Destaque</TableHead>
              <TableHead className="text-right">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && !error && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-pili-cement"
                >
                  Nenhum produto cadastrado
                </TableCell>
              </TableRow>
            )}
            {products.map((product) => {
              const translation = product.translations[0];
              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    {translation?.name ?? product.slug}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {CATEGORY_LABELS[product.category] ?? product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.active ? "default" : "outline"}
                    >
                      {product.active ? "Sim" : "Nao"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <form
                      action={async () => {
                        "use server";
                        await toggleProductFeatured(product.id);
                      }}
                    >
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon-xs"
                        title={
                          product.featured
                            ? "Remover destaque"
                            : "Destacar produto"
                        }
                      >
                        <Star
                          className={
                            product.featured
                              ? "size-4 fill-pili-safety text-pili-safety"
                              : "size-4 text-pili-cement"
                          }
                        />
                      </Button>
                    </form>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-xs" asChild>
                        <Link href={`/admin/produtos/${product.id}`}>
                          <Pencil className="size-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                      <form
                        action={async () => {
                          "use server";
                          await deleteProduct(product.id);
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
