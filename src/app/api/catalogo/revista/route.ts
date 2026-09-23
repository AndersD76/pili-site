import { NextResponse } from "next/server";
import { getProdutosRevista, type LocaleCatalogo } from "@/lib/catalogo-dados";
import { logError } from "@/lib/prisma-errors";

export const runtime = "nodejs";

/**
 * Conteúdo do catálogo folheável.
 *
 * A página `/catalogo` é um Client Component — precisa do formulário — então
 * não consegue ler o banco direto. Esta rota entrega os mesmos produtos que o
 * PDF, mas com as fotos por URL em vez de embutidas.
 *
 * Não é rota protegida: o conteúdo é o mesmo do catálogo público, e é a página
 * que pede o contato antes de abrir. Tratar isto como segredo daria falsa
 * sensação de proteção, já que as fichas já estão em `/produtos`.
 */
export async function GET(request: Request) {
  try {
    const param = new URL(request.url).searchParams.get("locale");
    const locale: LocaleCatalogo = param === "es" ? "es" : "pt-BR";

    const produtos = await getProdutosRevista(locale);

    return NextResponse.json(
      { produtos },
      {
        // O catálogo muda quando o painel muda; cinco minutos é a mesma janela
        // de revalidação das páginas de produto.
        headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
      },
    );
  } catch (err) {
    logError("CATALOGO_REVISTA", err);
    return NextResponse.json(
      { error: "Erro ao carregar o catálogo." },
      { status: 500 },
    );
  }
}
