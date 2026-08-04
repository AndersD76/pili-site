import { setRequestLocale } from "next-intl/server";
import { getProdutos } from "@/lib/content";
import { CompararTabela } from "@/components/marketing/comparar-tabela";

/**
 * O conteúdo vem do banco e muda pelo painel. Com ISR a página é servida do
 * cache e revalidada em segundo plano — as edições aparecem sem redeploy, e a
 * primeira visita não paga a consulta.
 */
export const revalidate = 300;

/**
 * A tabela de comparação é interativa (seleção de modelos) e precisa rodar no
 * cliente; a busca no banco fica aqui, no servidor, e desce por prop.
 */
export default async function CompararPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const produtos = await getProdutos();

  return <CompararTabela PRODUCTS={produtos} />;
}
