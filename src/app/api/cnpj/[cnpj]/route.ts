import { NextResponse } from "next/server";
import { consultarCnpj } from "@/lib/brasil-api";
import { cnpjValido } from "@/lib/documento";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Preenchimento da razão social no formulário de orçamento.
 *
 * O navegador chama esta rota em vez da BrasilAPI direto: assim a CSP do site
 * não precisa liberar um domínio novo, e dá para limitar quantas consultas cada
 * visitante faz. A cota é separada da do envio de lead — sem isso, quem
 * corrigisse o CNPJ algumas vezes ficaria impedido de enviar o formulário.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ cnpj: string }> },
) {
  const { cnpj } = await params;

  // Dígito errado nem sai daqui: não gasta consulta nem cota.
  if (!cnpjValido(cnpj)) {
    return NextResponse.json({ status: "inexistente" }, { status: 404 });
  }

  const ip = getClientIp(request) ?? "unknown";
  const cota = await consumeRateLimit({
    key: `cnpj:${ip}`,
    limit: 20,
    windowSeconds: 600,
  });
  if (!cota.success) {
    return NextResponse.json({ status: "limite" }, { status: 429 });
  }

  const r = await consultarCnpj(cnpj);

  if (r.status === "inexistente") {
    return NextResponse.json({ status: "inexistente" }, { status: 404 });
  }
  if (r.status === "indisponivel") {
    // Sem resposta do serviço o formulário segue sem preencher nada.
    return NextResponse.json({ status: "indisponivel" }, { status: 200 });
  }

  return NextResponse.json({
    status: "ok",
    razaoSocial: r.razaoSocial,
    nomeFantasia: r.nomeFantasia,
    municipio: r.municipio,
    uf: r.uf,
    encerrada: r.encerrada,
  });
}
