"use server";

import { requireRoleOrThrow } from "@/lib/auth-guard";
import { consumeRateLimit } from "@/lib/rate-limit";
import {
  traduzirParaEspanhol,
  traducaoDisponivel,
  type CamposTraduziveis,
} from "@/lib/traduzir";

/**
 * Traduz os campos de um formulário do painel para espanhol.
 *
 * A chave da API fica no servidor: o formulário manda o texto em português e
 * recebe o espanhol de volta para o editor revisar antes de salvar. Nada é
 * gravado aqui.
 */
export async function traduzirCampos(
  campos: CamposTraduziveis,
): Promise<
  { success: true; campos: CamposTraduziveis } | { success: false; error: string }
> {
  const session = await requireRoleOrThrow("ADMIN", "COMERCIAL");

  if (!traducaoDisponivel()) {
    return {
      success: false,
      error: "Tradução automática não configurada (falta ANTHROPIC_API_KEY).",
    };
  }

  // Cada tradução é uma chamada paga; o limite evita que um clique repetido
  // vire dez chamadas do mesmo texto.
  const rate = await consumeRateLimit({
    key: `traducao:${session.user.id}`,
    limit: 30,
    windowSeconds: 60 * 10,
  });

  if (!rate.success) {
    return {
      success: false,
      error: "Muitas traduções seguidas. Aguarde alguns minutos.",
    };
  }

  const resultado = await traduzirParaEspanhol(campos);

  return resultado.ok
    ? { success: true, campos: resultado.campos }
    : { success: false, error: resultado.erro };
}
