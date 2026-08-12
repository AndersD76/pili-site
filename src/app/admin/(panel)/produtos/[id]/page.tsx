import Link from "next/link";
import { traducaoDisponivel } from "@/lib/traduzir";
import { MediaUploader } from "@/components/admin/media-uploader";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { getProductById } from "../actions";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");

  const { id } = await params;
  const { data: product, error } = await getProductById(id);

  if (!product || error) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/produtos">
            <ArrowLeft className="size-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-pili-black">
            Editar produto
          </h1>
          <p className="text-sm text-pili-concrete">
            Atualize os dados do produto
          </p>
        </div>
      </div>

      <ProductForm product={product} traducaoAtiva={traducaoDisponivel()} />

      <div className="max-w-2xl rounded-lg border border-pili-mist bg-pili-white p-6">
        <MediaUploader
          productId={product.id}
          initialItems={product.media ?? []}
          label="Fotos do produto"
          help="Aparecem na página do produto e na listagem do catálogo."
        />
      </div>
    </div>
  );
}
