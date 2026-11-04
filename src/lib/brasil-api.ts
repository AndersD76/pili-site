import "server-only";
import { apenasDigitos } from "./documento";

/**
 * Consulta de CNPJ na BrasilAPI (https://brasilapi.com.br) — gratuita, sem
 * cadastro e sem chave.
 *
 * Serve para duas coisas: preencher a razão social sozinha quando o visitante
 * digita o CNPJ, e recusar empresa que não existe ou foi baixada.
 *
 * Nunca derruba a captura de lead. É um serviço de terceiro, sem garantia de
 * disponibilidade: fora do ar ou lento, a resposta é "indisponível" e quem
 * chama segue com o lead. Recusar um cliente de verdade porque a API caiu
 * custaria mais do que deixar passar um CNPJ sem conferir.
 */

/** A captura de lead não pode esperar mais do que isto por um terceiro. */
const LIMITE_MS = 4_000;

/** Situações em que a empresa deixou de existir. "Inapta" ou "suspensa" passam. */
const SITUACOES_ENCERRADAS = new Set(["BAIXADA", "NULA"]);

export type ConsultaCnpj =
  | {
      status: "ok";
      razaoSocial: string;
      nomeFantasia: string | null;
      situacao: string;
      municipio: string | null;
      uf: string | null;
      encerrada: boolean;
    }
  | { status: "inexistente" }
  | { status: "indisponivel" };

export async function consultarCnpj(cnpj: string): Promise<ConsultaCnpj> {
  const d = apenasDigitos(cnpj);

  try {
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${d}`, {
      // Sem User-Agent a BrasilAPI responde 403 ao `fetch` do Node — e o
      // fail-open transformava toda consulta em "indisponível" sem alarde.
      headers: { "User-Agent": "pili-site/1.0 (+https://www.pili.ind.br)" },
      signal: AbortSignal.timeout(LIMITE_MS),
      // O cadastro de uma empresa muda pouco; um dia de cache poupa a API e
      // deixa o preenchimento instantâneo para quem volta ao formulário.
      next: { revalidate: 86_400 },
    });

    // 404: CNPJ com dígito válido mas sem empresa. 400: dígito inválido.
    if (res.status === 404 || res.status === 400) return { status: "inexistente" };
    if (!res.ok) return { status: "indisponivel" };

    const dados = (await res.json()) as {
      razao_social?: string;
      nome_fantasia?: string | null;
      descricao_situacao_cadastral?: string;
      municipio?: string | null;
      uf?: string | null;
    };
    if (!dados.razao_social) return { status: "indisponivel" };

    const situacao = (dados.descricao_situacao_cadastral ?? "").toUpperCase();
    return {
      status: "ok",
      razaoSocial: dados.razao_social,
      nomeFantasia: dados.nome_fantasia || null,
      situacao,
      municipio: dados.municipio ?? null,
      uf: dados.uf ?? null,
      encerrada: SITUACOES_ENCERRADAS.has(situacao),
    };
  } catch {
    // Timeout, DNS, rede: sem resposta não é "não existe".
    return { status: "indisponivel" };
  }
}
