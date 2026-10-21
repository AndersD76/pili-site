/**
 * Campo honeypot dos formulários públicos.
 *
 * Um campo de texto que a pessoa não vê nem alcança pelo teclado, mas que os
 * robôs de spam preenchem, porque preenchem tudo o que encontram no formulário.
 * Veio preenchido: o servidor responde como se tivesse gravado e descarta.
 *
 * Os robôs que chegaram ao painel em setembro e outubro de 2026 mandavam nome,
 * empresa e mensagem com letras aleatórias e um e-mail do Gmail cheio de pontos
 * (o Gmail ignora os pontos, então cada variação parece única e cai na mesma
 * caixa). O limite por IP não pegava: era um envio a cada poucos dias.
 *
 * O nome é proposital. "website", "url" ou "company" são reconhecidos pelo
 * preenchimento automático do navegador, que completaria o campo sozinho e
 * faria um lead de verdade ser descartado em silêncio. Este nome não
 * corresponde a nenhum tipo de dado que o navegador saiba preencher.
 *
 * Fica fora do schema do Zod de propósito: as rotas checam o campo antes da
 * validação, e o Zod descarta chaves desconhecidas. Assim o valor nunca chega
 * ao `db.lead.create`, onde uma chave a mais faria o Prisma recusar a gravação.
 */
export const CAMPO_ARMADILHA = "referencia_interna";

/** O robô preencheu o campo que nenhuma pessoa vê. */
export function caiuNaArmadilha(valor: unknown): boolean {
  return typeof valor === "string" && valor.trim().length > 0;
}
